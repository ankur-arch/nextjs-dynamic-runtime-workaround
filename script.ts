import * as fs from "fs";
import * as path from "path";

const directoryPath = "./src/app/api"; // Replace with the path to your directory

const searchLine = 'export const runtime = "nodejs";';
const replaceLine = 'export const runtime = "edge";';

function crawlAndReplaceFiles(
  directoryPath: string,
  search: string,
  replace: string
) {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directoryPath, file);

      

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Error reading file: ${err}`);
          return;
        }

        if (stats.isFile()) {
          // Read the file's content
          fs.readFile(filePath, "utf8", (err, data) => {
            if (err) {
              console.error(`Error reading file: ${err}`);
              return;
            }

            if (data.includes("// skip")) {
                console.log(`Skipping file: ${filePath}`);
                return; // Skip processing this file
              }

            // Replace the searchLine with replaceLine
            const modifiedContent = data.replace(search, replace);

            // Write the modified content back to the file
            fs.writeFile(filePath, modifiedContent, "utf8", (err) => {
              if (err) {
                console.error(`Error writing file: ${err}`);
                return;
              }

              console.log(`Updated file: ${filePath}`);
            });
          });
        } else if (stats.isDirectory()) {
          // Recursively crawl subdirectories
          crawlAndReplaceFiles(filePath, search, replace);
        }
      });
    });
  });
}

if (process.env.RUNTIME == "edge") {
  crawlAndReplaceFiles(directoryPath, searchLine, replaceLine);
} else {
  crawlAndReplaceFiles(directoryPath, replaceLine, searchLine);
}
