import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { zip } from "zip-a-folder";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const zipName = "extension.zip";
const sourceDir = path.resolve(__dirname, "src");
const distDir = path.resolve(__dirname, "dist");
const zipPath = path.join(distDir, zipName);

// Delete old zip if exists
await fs.remove(zipPath);

// Create dist folder if it doesn't exist
await fs.ensureDir(distDir);

// Create temp folder inside src for copying files to zip
const tempDir = path.join(sourceDir, "__temp_zip__");
await fs.ensureDir(tempDir);

// Files to include in the zip
const filesToZip = ["icon.png", "index.html", "manifest.json"];

// Copy specific files from src to temp folder
await Promise.all(
    filesToZip.map((file) =>
        fs.copy(path.join(sourceDir, file), path.join(tempDir, file))
    )
);

// Create the zip from temp folder into dist folder
await zip(tempDir, zipPath);

// Clean up temp folder
await fs.remove(tempDir);

console.log(`Zipped files from ./src into ${zipPath}`);
