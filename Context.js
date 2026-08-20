// @cache-compatible
// CROSSED WIRES v3 — Context tab
// Append-only so it can work with AI Dungeon's cache-efficient context mode.
const modifier = (text) => {
  text = CW_onContext(text);
  return { text };
};
modifier(text);
