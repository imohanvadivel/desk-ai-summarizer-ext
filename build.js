import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import AdmZip from "adm-zip";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

appendAppInURL();
moveFiles();
setTimeout(() => zipFiles(), 100);

function moveFiles() {
    // Create the app directory in output
    const appDir = path.join(__dirname, "output", "app");
    if (!fs.existsSync(appDir)) {
        fs.mkdirSync(appDir);
    }

    // Paths to the files/directories you want to move
    const sourceFiles = [
        path.join(__dirname, "output", "widget1.html"),
        path.join(__dirname, "output", "widget2.html"),
        path.join(__dirname, "output", "chunks"),
        path.join(__dirname, "output", "assets")
    ];

    const destinationDir = path.join(__dirname, "output", "app");

    // Ensure the destination directory exists
    if (!fs.existsSync(destinationDir)) {
        console.error("Destination directory does not exist");
        process.exit(1);
    }

    // Move each file/directory to the destination directory
    sourceFiles.forEach((source) => {
        const destPath = path.join(destinationDir, path.basename(source));

        fs.rename(source, destPath, (err) => {
            if (err) {
                console.error(`Error moving ${source}:`, err);
            }
        });
    });
}

function appendAppInURL() {
    // Define the path to the JSON file
    const filePath = path.join(__dirname, "output/plugin-manifest.json");

    // Read the JSON file
    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        // Parse the JSON data
        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error("Error parsing JSON:", parseError);
            return;
        }

        // Modify the "url" field in the "widgets" array
        if (jsonData.modules && jsonData.modules.widgets) {
            jsonData.modules.widgets.forEach((widget) => {
                if (widget.url && !widget.url.startsWith("/app")) {
                    widget.url = `/app${widget.url}`;
                }
                if (widget.logo && !widget.logo.startsWith("/app")) {
                    widget.logo = `/app${widget.logo}`;
                }
                if (widget.icon && !widget.icon.startsWith("/app")) {
                    widget.icon = `/app${widget.icon}`;
                }
            });
        }

        // Convert the modified JSON back to a string
        const updatedJson = JSON.stringify(jsonData, null, 2);

        // Write the updated JSON back to the file
        fs.writeFile(filePath, updatedJson, "utf8", (writeErr) => {
            if (writeErr) {
                console.error("Error writing the manifest file:", writeErr);
            }
        });
    });
}

function zipFiles() {
    const zip = new AdmZip();
    const filePath = path.join(__dirname, "output");
    zip.addLocalFolder(filePath);
    const outputZipPath = path.join(__dirname, "dist", "ext.zip");
    zip.writeZip(outputZipPath);
    console.log(`Zipped file saved to ${outputZipPath}`);
}
