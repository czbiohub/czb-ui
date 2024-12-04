import { rgb, scaleOrdinal, schemeTableau10 } from "d3";

export class Legend {
  private container: HTMLDivElement;
  private colorScale = scaleOrdinal(schemeTableau10);

  constructor() {
    this.container = document.createElement("div");
    this.container.style.position = "absolute";
    this.container.style.top = "20px";
    this.container.style.left = "20px";
    this.container.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
    this.container.style.padding = "10px";
    this.container.style.borderRadius = "5px";
    this.container.style.overflowY = "auto";
  }

  update(categories: string[] | null, highlightMode: boolean = false) {
    this.container.innerHTML = "";

    if (!categories || categories.length === 0) {
      this.container.style.display = "none";
      return;
    }

    this.container.style.display = "block";

    categories.forEach((category, index) => {
      const row = document.createElement("div");
      row.style.display = "flex";
      row.style.alignItems = "center";
      row.style.marginBottom = "5px";

      const colorBox = document.createElement("div");
      colorBox.style.width = "20px";
      colorBox.style.height = "20px";
      colorBox.style.marginRight = "8px";

      const color = rgb(this.colorScale(index.toString()));
      colorBox.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
      colorBox.style.border = "1px solid #ccc";

      const label = document.createElement("span");
      label.textContent = category;
      label.style.fontSize = "14px";

      row.appendChild(colorBox);
      row.appendChild(label);
      this.container.appendChild(row);
    });
  }

  getElement(): HTMLDivElement {
    return this.container;
  }
}
