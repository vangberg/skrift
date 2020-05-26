module.exports = [
  {
    mode: "development",
    entry: "./src/main/index.ts",
    target: "electron-main",
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }],
        },
      ],
    },
    output: {
      path: __dirname + "/build",
      filename: "electron.js",
    },
  },
];
