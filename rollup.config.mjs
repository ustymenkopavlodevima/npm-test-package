import dts from "rollup-plugin-dts";
import sass from "rollup-plugin-sass";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

const external = /node_modules/;

const config = [
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/esm/index.js",
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      commonjs(),
      sass({ output: true }),
      resolve(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external,
  },
  {
    input: "src/Graph/exportRenderGraph.tsx",
    output: [
      {
        file: "dist/umd/index.js",
        format: "umd",
        name: "DeploymentGraph",
        esModule: false,
        exports: "named",
        sourcemap: true,
        globals: {
          react: "React",
          "react-dom/client": "ReactDOM",
        },
      },
    ],
    plugins: [
      typescript({ tsconfig: "./tsconfig.json", outDir: "dist/umd" }),
      sass({ output: true }),
      resolve({
        browser: true,
        dedupe: ["react", "react-dom/client"],
        extensions: [".js", ".jsx"],
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
        preventAssignment: true,
      }),
      commonjs({
        defaultIsModuleExports: true,
        include: ["node_modules/**"],
      }),
      terser(),
    ],
  },
  {
    input: "dist/esm/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "esm" }],
    external: [/\.scss$/],
    plugins: [dts()],
  },
];

export default config;
