import HtmlWebpackPlugin from "html-webpack-plugin";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
  {
    mode: "development",
    entry: {
      app: "./src/skrift-electron/renderer/app.tsx",
      about: "./src/skrift-electron/renderer/about.tsx",
    },
    target: "electron-renderer",
    devtool: "source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      extensionAlias: {
        ".js": [".ts", ".tsx", ".js"]
      }
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: "ts-loader" }],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ["style-loader", "css-loader", "postcss-loader"],
        },
        {
          test: /\.css$/,
          include: /node_modules/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    output: {
      path: __dirname + "/build",
      filename: "[name].js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/skrift-electron/renderer/app.html",
        chunks: ["app"],
        filename: "app.html",
      }),
      new HtmlWebpackPlugin({
        template: "./src/skrift-electron/renderer/about.html",
        chunks: ["about"],
        filename: "about.html",
        inject: "head",
      }),
    ],
  },
];
