module.exports = [
  {
    mode: "development",
    entry: "./src/skrift-electron/main/index.ts",
    target: "electron-main",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
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
      filename: "main.js",
    },
    externals: {
      "better-sqlite3": "commonjs better-sqlite3",
    },
  },
];
