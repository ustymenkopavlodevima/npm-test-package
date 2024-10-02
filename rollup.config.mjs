import { readFileSync } from "fs";
import { defineConfig } from "rollup";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import external from "rollup-plugin-peer-deps-external";
import babel from "@rollup/plugin-babel";
// import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import typescriptEngine from "typescript";

const packageJson = JSON.parse(readFileSync("./package.json"));

export default defineConfig(
  {
    input: "./src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "iife",
        sourcemap: false,
        exports: "named",
        name: "devname",
      },
      {
        file: packageJson.module,
        format: "esm",
        exports: "named",
        sourcemap: false,
      },
    ],
    plugins: [
      // postcss({
      //   plugins: [],
      //   minimize: true,
      // }),
      external({ includeDependencies: true }),
      resolve({ preferBuiltins: false }),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        typescript: typescriptEngine,
        sourceMap: false,
        exclude: ["config", "dist", "node_modules/**"],
      }),
      babel({
        babelHelpers: "bundled",
        presets: [
          "@babel/preset-typescript",
          "@babel/preset-react",
          [
            "@babel/preset-env",
            {
              targets: "defaults",
            },
          ],
        ],
        extensions: [".ts", ".tsx"],
      }),
    ],
  }
  // {
  //   input: "dist/esm/types/src/index.d.ts",
  //   output: [{ file: "dist/index.d.ts", format: "esm" }],
  //   external: [/\.(sc|sa|c)ss$/],
  //   plugins: [dts()],
  // }
);
