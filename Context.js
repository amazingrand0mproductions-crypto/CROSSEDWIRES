// @cache-compatible
// CROSSED WIRES — Context tab
// Append-only so cache-compatible model context can keep its stable prefix.
const modifier = (text) => {
  text = CW_onContext(text);
  return { text };
};
modifier(text);
