// scripts/rename404.js
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const distDir = path.resolve(__dirname, "../dist");
const indexFile = path.join(distDir, "index.html");
const notFoundFile = path.join(distDir, "404.html");

try {
  if (fs.existsSync(indexFile)) {
    fs.copyFileSync(indexFile, notFoundFile);
    console.log("✅ dist/404.html created successfully!");
  } else {
    console.error("❌ index.html not found in dist folder!");
  }
} catch (err) {
  console.error("❌ Failed to copy index.html to 404.html:", err);
  process.exit(1);
}
