module.exports = function sanitize(value, helpers) {
  if (typeof value !== "string") return value;

  // Remove dangerous characters
  return value.replace(/[<>\/\\()"';%{}\[\]=+*]/g, "");
};
