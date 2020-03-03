import { ErrorAction } from "./types";

export const errorHandler = (error: Error): ErrorAction => {
  return { type: "ERROR", message: error.message };
};
