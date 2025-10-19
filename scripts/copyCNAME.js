// scripts/copyCNAME.js
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const distDir = path.resolve(__dirname, "../dist");

const sourceCNAME = path.resolve(__dirname, "../CNAME");

const targetCNAME = path.join(distDir, "CNAME");

try {
    if (fs.existsSync(sourceCNAME)) {
        fs.copyFileSync(sourceCNAME, targetCNAME);
        console.log("✅ dist/CNAME copied successfully!");
    } else {
        console.error("❌ CNAME file not found in project root!");
    }
} catch (err) {
    console.error("❌ Failed to copy CNAME to dist:", err);
    process.exit(1);
}
