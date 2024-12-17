import { ZarrArray, openArray, HTTPStore, NestedArray, TypedArray } from "zarr";
import { Attributes } from "zarr/types/attributes";
import { UserAttributes } from "zarr/types/types";

class Layer extends EventTarget {
  name: string;
  type: "positions" | "colors";
  zarrArray: ZarrArray | null;
  label: string;
  enabled: boolean;
  selectedAttribute: string | "None";
  attributesCache: string[] | null;
  typedArrayCache: Int32Array | Float32Array | null;

  constructor(name: string, type: "positions" | "colors", label: string) {
    super();
    this.name = name;
    this.type = type;
    this.zarrArray = null;
    this.label = label;
    this.enabled = true;
    this.selectedAttribute = "None";
    this.attributesCache = null;
    this.typedArrayCache = null;
  }

  async loadZarr(store: string, path: string) {
    const zarrToLoad = await openArray({
      store: new HTTPStore(store),
      path: path,
      mode: "r",
    });

    this.zarrArray = zarrToLoad;
  }

  checkIfZarrArrayLoaded() {
    if (this.zarrArray === null) {
      throw new Error("Zarr array not loaded");
    }
  }

  async getTypedArray() {
    this.checkIfZarrArrayLoaded();

    if (this.typedArrayCache !== null) {
      return this.typedArrayCache;
    }

    const nestedArray =
      (await this.zarrArray!.get()) as NestedArray<TypedArray>;
    const data = nestedArray.data as Int32Array | Float32Array;

    this.typedArrayCache = data;

    return data;
  }

  async getTypedArrayWithSelectedAttributeFiltered(): Promise<{
    filteredData: Int32Array;
    selectedAttributeIndex: number;
    attributesLength: number;
  }> {
    this.checkIfZarrArrayLoaded();
    const attrs = await this.getAttributes();
    const attributesLength = attrs.length;

    // Since we are dealing with an attribute/color layer,
    // we know that the data is an Int32Array
    const data = (await this.getTypedArray()) as Int32Array;

    if (this.selectedAttribute === "None") {
      return {
        filteredData: data,
        selectedAttributeIndex: -1,
        attributesLength,
      };
    }

    if (attrs === null) {
      throw new Error("Attributes not loaded");
    }

    // Find the index of the selected attribute
    const selectedAttributeIndex = attrs.indexOf(this.selectedAttribute);

    // Now go through each element in the data, and if
    // data[i] != selectedAttributeIndex, set it to -1
    const filteredData = new Int32Array(data.length);

    for (let i = 0; i < data.length; i++) {
      if (data[i] !== selectedAttributeIndex) {
        filteredData[i] = -1;
      } else {
        filteredData[i] = data[i];
      }
    }

    return {
      filteredData,
      selectedAttributeIndex,
      attributesLength,
    };
  }

  async getAttributes() {
    this.checkIfZarrArrayLoaded();

    if (this.attributesCache !== null) {
      return this.attributesCache;
    }

    const attrs = await this.zarrArray!.attrs.asObject();

    this.attributesCache = attrs.map;

    return attrs.map as Array<any>;
  }

  selectAttribute(attribute: string | "None") {
    this.selectedAttribute = attribute;

    this.dispatchEvent(new Event("newAttributeSelected"));
  }

  enable() {
    this.enabled = true;
    this.dispatchEvent(new Event("enabled"));
  }

  disable() {
    this.enabled = false;
    this.dispatchEvent(new Event("disabled"));
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

class LayerManager {
  layers: Map<number, Layer>;
  typeLookup: Record<"positions" | "colors", number[]>;
  soloedLayers: Record<"positions" | "colors", number>;

  constructor() {
    this.layers = new Map();
    this.typeLookup = {
      positions: [],
      colors: [],
    };
    this.soloedLayers = {
      positions: -1,
      colors: -1,
    };
  }

  addLayer(name: string, type: "positions" | "colors", label: string): number {
    const id = this.layers.size;
    const layer = new Layer(name, type, label);
    this.layers.set(id, layer);

    this.typeLookup[type].push(id);

    return id;
  }

  replaceLayer(
    name: string,
    type: "positions" | "colors",
    label: string,
    id: number
  ): number {
    if (this.layers.has(id)) {
      this.layers.delete(id);
    }

    const layer = new Layer(name, type, label);
    this.layers.set(id, layer);

    this.typeLookup[type].push(id);

    return id;
  }

  getLayer(id: number): Layer {
    if (this.layers.has(id)) {
      return this.layers.get(id)!;
    } else {
      throw new Error(`Layer with id ${id} does not exist`);
    }
  }

  private soloColorLayer(layerId: number) {
    // If requested layerId is -1, disable all color layers
    if (layerId === -1) {
      this.typeLookup.colors.forEach((id) => {
        this.getLayer(id).disable();
      });

      this.soloedLayers.colors = -1;
      return;
    }

    if (this.getLayer(layerId).type !== "colors") {
      return;
    }

    this.typeLookup.colors.forEach((id) => {
      if (id !== layerId) {
        this.getLayer(id).disable();
      } else {
        this.getLayer(id).enable();
      }
    });

    this.soloedLayers.colors = layerId;
  }

  private soloPositionLayer(layerId: number) {
    // If requested layerId is -1, disable all position layers
    if (layerId === -1) {
      this.typeLookup.positions.forEach((id) => {
        this.getLayer(id).disable();
      });

      this.soloedLayers.positions = -1;
      return;
    }

    if (this.getLayer(layerId).type !== "positions") {
      return;
    }

    console.log("soloPositionLayer");

    this.typeLookup.positions.forEach((id) => {
      if (id !== layerId) {
        this.getLayer(id).disable();
      } else {
        this.getLayer(id).enable();
      }
    });

    this.soloedLayers.positions = layerId;
  }

  soloLayer(type: "positions" | "colors", layerId: number) {
    switch (type) {
      case "positions":
        this.soloPositionLayer(layerId);
        break;
      case "colors":
        this.soloColorLayer(layerId);
        break;
      default:
        throw new Error(`Unknown layer type: ${type}`);
    }
  }

  getLayerLabelIdLookup(type: "positions" | "colors") {
    const lookup: Record<string, number> = {};

    this.typeLookup[type].forEach((id) => {
      lookup[this.getLayer(id).label] = id;
    });

    // Add a "None" option
    lookup["None"] = -1;

    return lookup;
  }

  getSoloedLayerInstance(type: "positions" | "colors") {
    return this.getLayer(this.soloedLayers[type]);
  }
}

export { Layer, LayerManager };
