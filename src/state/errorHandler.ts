import { Action } from "./types";

export const errorHandler = (error: Error): Action => {
  return { type: "ERROR", message: error.message };
};
