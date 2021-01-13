const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = [
  {
    mode: "development",
    entry: "./src/skrift-electron/renderer/react.tsx",
    target: "electron-renderer",
    devtool: "source-map",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
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
      filename: "react.js",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/skrift-electron/renderer/index.html",
      }),
    ],
  },
];
