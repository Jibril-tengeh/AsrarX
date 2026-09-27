const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== ".git" && file !== "dist") {
        results = results.concat(walk(fullPath));
      }
    } else if (file.endsWith(".tsx") || file.endsWith(".jsx")) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk("src");

files.forEach(file => {
  const content = fs.readFileSync(file, "utf8");
  const staticKeys = {};
  const regex = /key=(?:\{["'`]([^"'`]+)["'`]\}|["']([^"']+)["'])/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const k = match[1] || match[2];
    if (!staticKeys[k]) staticKeys[k] = [];
    staticKeys[k].push({ index: match.index, line: content.substring(0, match.index).split("\n").length });
  }
  for (const [k, occurrences] of Object.entries(staticKeys)) {
    if (occurrences.length > 1) {
      console.log(`[DUPLICATE STATIC KEY in ${file}]: key="${k}" at lines ${occurrences.map(o => o.line).join(", ")}`);
    }
  }
});
