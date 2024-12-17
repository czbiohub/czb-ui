// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.esm.js",
      format: "esm",
    },
  ],
  plugins: [
    typescript({ tsconfig: "./tsconfig.json" }),
    del({ targets: "dist/*", runOnce: true }),
  ],
  external: [
    /^@emotion\/.*/,
    /^@mui\/.*/,
    /^react\.*/,
    /^@deck.gl\/.*/,
    /^@loaders.gl\/.*/,
    "czifui",
  ],
};
