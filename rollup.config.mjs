import esbuild from "rollup-plugin-esbuild";
import filesize from "rollup-plugin-filesize";
import postcss from "rollup-plugin-postcss";
import externalPeer from "rollup-plugin-peer-deps-external";
import dts from "rollup-plugin-dts";

import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import replace from "@rollup/plugin-replace";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";

// const plugins = [
//   resolve({ extensions: [".js", ".jsx"] }),
//   esbuild(),
//   json(),
//   terser(),
//   filesize(),
// ];
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
      postcss(),
      resolve(),
      typescript({ tsconfig: "./tsconfig.json" }),
    ],
    external,
  },
  // {
  //   input: "dist/esm/index.js",
  //   output: [
  //     {
  //       file: "dist/cjs/index.js",
  //       format: "cjs",
  //       sourcemap: true,
  //     },
  //   ],
  //   plugins: [
  //     externalPeer(),
  //     resolve(),
  //     esbuild(),
  //     json(),
  //     // postcss(),
  //     // terser(),
  //   ],
  //   external,
  // },
  {
    input: "dist/esm/index.js",
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
      postcss(),
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
