import { scaleSequential, rgb, interpolateCool } from "d3";

const GREYED_COLOR = [10, 10, 10];
const HIGHLIGHT_COLOR = [255, 255, 0];

function convertIntTypedArrayToCategoryColors(
  intTypedArray: Int32Array,
  highlightMode: boolean,
  colorHighlightMaxValue: number,
  colorHighlightIndex?: number
): Uint8Array {
  // intTypedArray looks like [0, 0, 2, 1, 2] where each number is a category
  const colorScale = scaleSequential(interpolateCool);

  const categoryColors = new Uint8Array(intTypedArray.length * 3);
  for (let i = 0; i < intTypedArray.length; i++) {
    const value = intTypedArray[i];
    if (value === -1) {
      categoryColors[i * 3] = GREYED_COLOR[0];
      categoryColors[i * 3 + 1] = GREYED_COLOR[1];
      categoryColors[i * 3 + 2] = GREYED_COLOR[2];
      continue;
    }
    if (highlightMode) {
      if (colorHighlightIndex === undefined) {
        throw new Error("colorHighlightIndex is required in highlight mode");
      }
      const color = rgb(
        colorScale(colorHighlightIndex / colorHighlightMaxValue)
      );
      categoryColors[i * 3] = color.r;
      categoryColors[i * 3 + 1] = color.g;
      categoryColors[i * 3 + 2] = color.b;
      continue;
    }
    const color = rgb(colorScale(value / colorHighlightMaxValue));
    categoryColors[i * 3] = color.r;
    categoryColors[i * 3 + 1] = color.g;
    categoryColors[i * 3 + 2] = color.b;
  }
  return categoryColors;
}

export { convertIntTypedArrayToCategoryColors };
