module.exports = [
  {
    mode: "development",
    entry: "./src/main/index.ts",
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
      filename: "electron.js",
    },
    externals: {
      sqlite3: "commonjs sqlite3",
    },
  },
];
