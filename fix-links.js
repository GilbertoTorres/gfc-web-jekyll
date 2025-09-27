const fs = require("fs");
const path = require("path");

const TARGET_DIRS = ["_posts", "_pages", "."]; // add more folders if needed
const MD_EXT = [".md", ".markdown"];

// Regex for images: ![Alt](/path/to/file)
const imageRegex = /!\[(.*?)\]\(\/(.*?)\)/g;

// Regex for links: [Text](/path/to/page)
const linkRegex = /\[(.*?)\]\(\/(.*?)\)/g;

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let updated = content;

  // Replace image links
  updated = updated.replace(imageRegex, (_, alt, url) => {
    return `![${alt}]({{ "/${url}" | relative_url }})`;
  });

  // Replace regular links
  updated = updated.replace(linkRegex, (_, text, url) => {
    return `[${text}]({{ "/${url}" | relative_url }})`;
  });

  if (updated !== content) {
    fs.writeFileSync(filePath, updated, "utf8");
    console.log(`✅ Fixed: ${filePath}`);
  }
}

function scanDir(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (MD_EXT.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  });
}

TARGET_DIRS.forEach(scanDir);
console.log("🎉 All Markdown links/images have been processed.");
