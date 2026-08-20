// @cache-compatible
// CROSSED WIRES v4 — Context tab
// Append-only so it works with AI Dungeon's cache-efficient context mode.
const modifier = (text) => {
  text = CW_onContext(text);
  return { text };
};
modifier(text);
