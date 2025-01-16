import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
