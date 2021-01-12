import { OpenCardMode } from "./interfaces/state";

export const mouseEventToMode = (event: React.MouseEvent): OpenCardMode => {
  const { ctrlKey, metaKey, shiftKey } = event;

  const superKey = ctrlKey || metaKey;

  if (superKey && !shiftKey) {
    return "push";
  }

  if (shiftKey) {
    return "replace";
  }

  return "below";
};
