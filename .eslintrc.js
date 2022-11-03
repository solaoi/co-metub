module.exports = {
  extends: ["blitz"],
  rules: { "react/no-unknown-property": ["error", { ignore: ["global", "jsx"] }] },
}
