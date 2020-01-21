export function noteLink(state: Remarkable.StateInline, silent: boolean) {
  let found = false;
  let max = state.posMax;
  let start = state.pos;
  let lastChar: number;
  let nextChar: number;

  if (state.src.charCodeAt(start) !== 91 /* [ */) {
    return false;
  }
  if (silent) {
    return false;
  } // don't run any pairs in validation mode
  if (start + 4 >= max) {
    return false;
  }
  if (state.src.charCodeAt(start + 1) !== 91 /* [ */) {
    return false;
  }
  // @ts-ignore: Faulty typings
  if (state.level >= state.options.maxNesting) {
    return false;
  }

  lastChar = start > 0 ? state.src.charCodeAt(start - 1) : -1;
  nextChar = state.src.charCodeAt(start + 2);

  if (lastChar === 91 /* [ */) {
    return false;
  }
  if (nextChar === 91 /* [ */) {
    return false;
  }
  if (nextChar === 0x20 || nextChar === 0x0a) {
    return false;
  } // space/newline

  state.pos = start + 2;

  while (state.pos + 1 < max) {
    if (state.src.charCodeAt(state.pos) === 93 /* ] */) {
      if (state.src.charCodeAt(state.pos + 1) === 93 /* ] */) {
        found = true;
        break;
      }
    }

    state.parser.skipToken(state);
  }

  if (!found) {
    state.pos = start;
    return false;
  }

  // found!
  state.posMax = state.pos;
  state.pos = start + 2;

  if (!silent) {
    state.push({ type: "note_link_open", level: state.level++ });
    state.parser.tokenize(state);
    state.push({ type: "note_link_close", level: --state.level });
  }

  state.pos = state.posMax + 2;
  state.posMax = max;
  return true;
}
