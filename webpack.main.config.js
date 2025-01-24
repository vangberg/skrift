const __dirname = new URL('.', import.meta.url).pathname;

export default [
  {
    mode: "development",
    entry: "./src/skrift-electron/main/index.ts",
    target: "electron-main",
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      extensionAlias: {
        ".js": [".ts", ".js"]
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          include: /src/,
          use: [{ loader: "ts-loader" }],
        },
        {
          test: /\.node$/,
          loader: "node-loader",
        },
      ],
    },
    output: {
      path: __dirname + "/build",
      filename: "main.js",
      module: true,
    },
    experiments: {
      outputModule: true
    },
    externals: {
      "better-sqlite3": "better-sqlite3",
    },
  },
];
