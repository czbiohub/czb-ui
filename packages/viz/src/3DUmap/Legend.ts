import { rgb, scaleOrdinal, schemeTableau10 } from "d3";

interface CategoryItem {
  name: string;
  color: { r: number; g: number; b: number };
}

export class Legend {
  private container: HTMLDivElement;
  private colorScale = scaleOrdinal(schemeTableau10);
  private items: CategoryItem[] = [];

  constructor() {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "0";
    this.container.style.left = "0";
    this.container.style.margin = "24px";
    this.container.style.padding = "28px";
    this.container.style.zIndex = "2";
    this.container.style.borderRadius = "4px";
    this.container.style.overflowY = "auto";
  }

  update(
    categories: string[] | null,
    categoryValues: Int32Array | null,
    highlightMode: boolean = false
  ) {
    if (!categories || !categoryValues || categories.length === 0) {
      this.container.style.display = "none";
      this.items = [];
      return;
    }

    // First collect all items
    this.items = [];
    const uniqueValues = Array.from(new Set(categoryValues));

    uniqueValues.forEach((value) => {
      if (value === -1) return; // Skip filtered values

      const categoryIndex = value;
      const name = categories[categoryIndex].replace(/_/g, " ");
      const color = rgb(this.colorScale(value.toString()));

      this.items.push({ name, color });
    });

    // Sort items by name
    this.items.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      })
    );

    // Render the sorted items
    this.render();
  }

  private render() {
    this.container.innerHTML = "";
    this.container.style.display = "block";

    this.items.forEach(({ name, color }) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.marginBottom = "5px";

      const colorBox = document.createElement("div");
      colorBox.style.width = "20px";
      colorBox.style.height = "20px";
      colorBox.style.marginRight = "8px";
      colorBox.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      colorBox.style.border = "1px solid #ccc";

      const label = document.createElement("span");
      label.textContent = name;
      label.style.fontSize = "14px";
      label.style.textShadow = `
        -1px -1px 0 white,
        1px -1px 0 white,
        -1px 1px 0 white,
        1px 1px 0 white
      `;

      row.appendChild(colorBox);
      row.appendChild(label);
      this.container.appendChild(row);
    });
  }

  getElement(): HTMLDivElement {
    return this.container;
  }
}
