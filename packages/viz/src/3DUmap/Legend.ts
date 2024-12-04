import { rgb, scaleOrdinal, schemeTableau10 } from "d3";

export class Legend {
  private container: HTMLDivElement;
  private colorScale = scaleOrdinal(schemeTableau10);

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

  update(categories: string[] | null, highlightMode: boolean = false) {
    this.container.innerHTML = "";

    if (!categories || categories.length === 0) {
      this.container.style.display = "none";
      return;
    }

    this.container.style.display = "block";

    const sortedCategories = [...categories].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );

    sortedCategories.forEach((category, index) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.marginBottom = "5px";

      const colorBox = document.createElement("div");
      colorBox.style.width = "20px";
      colorBox.style.height = "20px";
      colorBox.style.marginRight = "8px";

      const originalIndex = categories.indexOf(category);
      const color = rgb(this.colorScale(originalIndex.toString()));
      colorBox.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      colorBox.style.border = "1px solid #ccc";

      const label = document.createElement("span");
      label.textContent = category;
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
