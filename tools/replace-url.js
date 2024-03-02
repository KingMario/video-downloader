const path = require("path");
const fs = require("fs");

["background.js", "manifest.json"]
  .map((file) => path.resolve(__dirname, "..", "dist", file))
  .forEach((filePath) => {
    fs.writeFileSync(
      filePath,
      fs
        .readFileSync(filePath, "utf-8")
        .replace(/URL_IDENTIFICATION_STRING/g, "example.com/path")
    );
  });
