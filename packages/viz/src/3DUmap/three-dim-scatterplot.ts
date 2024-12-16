import * as THREE from "three";
// https://stackoverflow.com/a/56338877/10013136
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { ZarrArray, openArray, HTTPStore, NestedArray, TypedArray } from "zarr";
import { UserAttributes } from "zarr/types/types";
import GUI from "lil-gui";
import { LayerManager } from "./layer";
import { convertIntTypedArrayToCategoryColors } from "./colors";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

const vertexShader = `
uniform float size;
attribute vec3 color;
varying vec3 vColor;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
varying vec3 vColor;

void main() {
    // A circle mask
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.5) {
        discard;
    }

    // Make points brighter
    vec3 brightColor = vColor * 1.5;
    gl_FragColor = vec4(brightColor, 1.0);
}
`;

export class ThreeDimScatterPlot {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private shaderMaterial: THREE.ShaderMaterial;
  private particleSystem: THREE.Points | null;
  private layerManager: LayerManager;
  private gui: GUI | null = null;
  private guiElement: HTMLDivElement | undefined = undefined;
  private geometry: THREE.BufferGeometry | null = null;
  private composer: EffectComposer;
  private bloomParams = {
    threshold: 0,
    strength: 0.5,
    radius: 0.5,
    exposure: 0.7714,
  };
  debug = false;
  private showAdvanced = false;

  constructor(element: HTMLDivElement) {
    this.particleSystem = null;
    this.layerManager = new LayerManager();
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        size: { value: 0.15 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
    // Move the camera back
    this.camera.position.z = 20;

    this.controls = new OrbitControls(this.camera, element);
    this.controls.autoRotate = true;

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: false,
      stencil: false,
    });

    // Get the device pixel ratio
    const pixelRatio = window.devicePixelRatio;

    // Set pixel ratio for high DPI displays
    this.renderer.setPixelRatio(pixelRatio);
    this.renderer.setSize(element.clientWidth, element.clientHeight);

    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    element.appendChild(this.renderer.domElement);

    const renderScene = new RenderPass(this.scene, this.camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(element.clientWidth, element.clientHeight),
      this.bloomParams.strength,
      this.bloomParams.radius,
      this.bloomParams.threshold
    );

    const outputPass = new OutputPass();

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(renderScene);
    this.composer.addPass(bloomPass);
    this.composer.addPass(outputPass);

    this.refreshGui();
    this.setupAdvancedControls();

    // TODO: WebGL compatibility check
    // https://threejs.org/docs/index.html#manual/en/introduction/WebGL-compatibility-check

    this.animate();
  }

  private async animate() {
    // Use bind to ensure `this` inside animate() always refers to the ThreeDimScatterPlot instance,
    // even when the method is passed as a callback to requestAnimationFrame.
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.composer.render();
  }

  private async refreshGui() {
    // Clear UI
    if (this.gui) {
      this.gui.destroy();
    }
    this.gui = new GUI({ container: this.guiElement });

    // Auto rotating toggle (keep this outside advanced)
    this.gui.add(this.controls, "autoRotate").name("Auto rotate");

    // Advanced controls folder
    let advancedFolder: GUI | undefined;
    if (this.showAdvanced) {
      advancedFolder = this.gui.addFolder("Advanced");

      // Point size
      advancedFolder
        .add(this.shaderMaterial.uniforms.size, "value")
        .min(0.01)
        .max(1)
        .step(0.01)
        .name("Point size");

      // Rotate speed
      advancedFolder
        .add(this.controls, "autoRotateSpeed", 0.1, 10, 0.1)
        .setValue(1.3)
        .name("Rotate speed");
    }

    // Colors dropdown (keep this outside advanced)
    const colorItems = this.layerManager.getLayerLabelIdLookup("colors");
    this.gui
      .add(this.layerManager.soloedLayers, "colors", colorItems)
      .onChange((layerId: number) => {
        this.layerManager.soloLayer("colors", layerId);
        // The selectedAttribute dropdown
        // would need to update, based on the
        // color layer selected. So refresh the GUI
        this.refreshGui();
      })
      .name("Attributes");

    // If colors is set to "None", don't show the selectedAttribute dropdown
    if (this.layerManager.soloedLayers.colors === -1) {
      return;
    }

    const currentLayerInstance =
      this.layerManager.getSoloedLayerInstance("colors");

    let currentColorAttributes = await currentLayerInstance.getAttributes();

    // Copy the array so we can sort it and add "None" to it
    currentColorAttributes = [...currentColorAttributes];

    if (!currentColorAttributes) {
      return;
    }

    // Sort by alphabetical order (with smart numeric sorting)
    // https://stackoverflow.com/a/38641281/10013136
    currentColorAttributes.sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    );

    // Append "None" option at the beginning
    currentColorAttributes.unshift("None");

    // Attributes of current color dropdown (keep this outside advanced)
    this.gui
      .add(currentLayerInstance, "selectedAttribute", currentColorAttributes)
      .onChange((attribute: string) => {
        currentLayerInstance.selectAttribute(attribute);
      })
      .name("Highlight");
    // As of now since lil-gui doesn't have
    // multi-select dropdowns, we can't have
    // multiple attributes selected at once.

    // Add bloom and tone mapping controls to advanced section
    if (this.showAdvanced && advancedFolder) {
      // Bloom controls
      advancedFolder
        .add(this.bloomParams, "threshold", 0.0, 1.0)
        .onChange((value: number) => {
          const bloomPass = this.composer.passes.find(
            (pass) => pass instanceof UnrealBloomPass
          ) as UnrealBloomPass;
          if (bloomPass) {
            bloomPass.threshold = value;
          }
        })
        .name("Bloom threshold");

      advancedFolder
        .add(this.bloomParams, "strength", 0.0, 3.0)
        .onChange((value: number) => {
          const bloomPass = this.composer.passes.find(
            (pass) => pass instanceof UnrealBloomPass
          ) as UnrealBloomPass;
          if (bloomPass) {
            bloomPass.strength = value;
          }
        })
        .name("Bloom strength");

      advancedFolder
        .add(this.bloomParams, "radius", 0.0, 1.0)
        .step(0.01)
        .onChange((value: number) => {
          const bloomPass = this.composer.passes.find(
            (pass) => pass instanceof UnrealBloomPass
          ) as UnrealBloomPass;
          if (bloomPass) {
            bloomPass.radius = value;
          }
        })
        .name("Bloom radius");

      advancedFolder
        .add(this.bloomParams, "exposure", 0.1, 2)
        .onChange((value: number) => {
          this.renderer.toneMappingExposure = Math.pow(value, 4.0);
        })
        .name("Tone Mapping exposure");
    }
  }

  private setupAdvancedControls() {
    document.addEventListener("keydown", (event) => {
      // Check for Cmd+A (Mac) or Ctrl+A (Windows/Linux)
      if ((event.metaKey || event.ctrlKey) && event.key === "a") {
        event.preventDefault(); // Prevent default select-all behavior
        this.showAdvanced = true;
        this.refreshGui();
      }
    });
  }

  setGuiContainer(element: HTMLDivElement) {
    this.guiElement = element;
    this.refreshGui();
  }

  updateViewportSize(width: number, height: number) {
    this.renderer.setSize(width, height);
    this.composer.setSize(width, height);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
  }

  setGuiOpen(open: boolean) {
    if (this.gui) {
      this.gui.open(open);
    }
  }

  async loadZarr(
    store: string,
    path: string,
    name: string,
    displayType: "positions" | "colors",
    label: string
  ) {
    this.log("Loading new zarr: " + path);
    const zarrToLoad = await openArray({
      store: new HTTPStore(store),
      path: path,
      mode: "r",
    });

    let layerId: number = -1;

    const currentPositionsLayerId = this.layerManager.soloedLayers.positions;
    if (displayType === "positions" && currentPositionsLayerId !== -1) {
      // Only one position layer can be displayed, so
      // if a new position layer is loaded, replace it
      this.log("Replacing positions layer");
      layerId = this.layerManager.replaceLayer(
        name,
        displayType,
        label,
        currentPositionsLayerId
      );
    } else {
      this.log("Adding layer normally");
      layerId = this.layerManager.addLayer(name, displayType, label);
    }

    if (layerId === -1) {
      throw new Error("Layer ID is -1.");
    }

    const layer = this.layerManager.getLayer(layerId);
    layer.zarrArray = zarrToLoad;

    if (displayType === "positions") {
      await this.drawPoints(layerId);
      this.layerManager.soloLayer("positions", layerId);

      // If there is a selected color layer already, color the points
      const currentColorLayerId = this.layerManager.soloedLayers.colors;
      if (currentColorLayerId !== -1) {
        this.colorPoints(currentColorLayerId);
      }
    }

    if (displayType === "colors") {
      this.colorPoints(layerId);
      this.layerManager.soloLayer("colors", layerId);

      layer.addEventListener("enabled", () => {
        this.log("Enabled colors event");
        this.colorPoints(layerId);
      });

      layer.addEventListener("disabled", () => {
        this.log("Disabled colors event");
        this.disableColor();
      });

      layer.addEventListener("newAttributeSelected", () => {
        this.log(`New attribute selected: ${layer.selectedAttribute}`);
        this.colorPoints(layerId);
      });
    }

    this.refreshGui();
  }

  async drawPoints(layerId: number) {
    this.log("Drawing points");
    this.geometry = new THREE.BufferGeometry();

    // Positions attribute
    const positions = await this.layerManager.getLayer(layerId).getTypedArray();
    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );

    this.particleSystem = new THREE.Points(this.geometry, this.shaderMaterial);
    this.particleSystem.frustumCulled = false;

    this.scene.add(this.particleSystem);
  }

  async colorPoints(layerId: number) {
    this.log("Coloring points");
    if (!this.geometry) {
      throw new Error("Geometry is not initialized. Call drawPoints first.");
    }

    const layer = this.layerManager.getLayer(layerId);

    const {
      filteredData: colorCategories,
      selectedAttributeIndex,
      attributesLength,
    } = await layer.getTypedArrayWithSelectedAttributeFiltered();

    this.log("attributesLength: " + attributesLength);

    const inHighlightMode = layer.selectedAttribute !== "None";

    if (colorCategories instanceof Float32Array) {
      throw new Error("Color categories must be an Int32Array");
    }

    if (inHighlightMode) {
      this.log(
        `Highlighting mode: ${layer.selectedAttribute}, index: ${selectedAttributeIndex}, max: ${attributesLength}`
      );
    }

    const colors = convertIntTypedArrayToCategoryColors(
      colorCategories,
      inHighlightMode,
      attributesLength,
      selectedAttributeIndex
    );

    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3, true)
    );
  }

  disableColor() {
    if (!this.geometry) {
      throw new Error("Geometry is not initialized. Call drawPoints first.");
    }

    // Set the color attribute to a default value (white color)
    const defaultColor = new Float32Array(
      this.geometry.getAttribute("position").count * 3
    ).fill(1);
    this.geometry.setAttribute(
      "color",
      new THREE.BufferAttribute(defaultColor, 3, true)
    );
  }

  setOrbitControlOrigin(x: number, y: number, z: number) {
    this.controls.target.set(x, y, z);
  }

  log(message: string, css?: string) {
    if (this.debug) {
      console.log("%c" + message, css);
    }
  }
}
