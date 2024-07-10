const path = require("path");

module.exports = [
  {
    entry: ["./javascripts/index.js"],
    output: {
      path: path.resolve(__dirname, "build/javascripts"),
      filename: "bundle.js"
    }
  },
  {
    entry: ["./javascripts/editor.js"],
    output: {
      path: path.resolve(__dirname, "build/javascripts"),
      filename: "editor.js"
    }
  }
];
