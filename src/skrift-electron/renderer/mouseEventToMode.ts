import { OpenCardMode } from "./interfaces/state/index.js";

export const mouseEventToMode = (event: MouseEvent): OpenCardMode => {
  const { ctrlKey, metaKey, shiftKey } = event;
  const superKey = ctrlKey || metaKey;

  if (superKey) return "below";
  if (shiftKey) return "replace";

  return "push";
};
