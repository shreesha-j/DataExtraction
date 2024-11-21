import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

/**
 * Creates a ZIP file from a given folder path.
 * 
 * @param folderPath - Path to the folder to be zipped.
 * @param outputDirectory - Directory where the ZIP file will be saved.
 * @returns {string} - Path to the created ZIP file.
 * @throws {Error} - Throws an error if the operation fails.
 */
const createZipFromFolder = (folderPath: string, outputDirectory: string): string => {
  try {
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    // Get the folder name and construct the ZIP file name
    const folderName = path.basename(folderPath);
    const zipFileName = `${folderName}.zip`;
    const zipFilePath = path.join(outputDirectory, zipFileName);

    // Create the output directory if it doesn't exist
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    // Initialize AdmZip and add the folder contents
    const zip = new AdmZip();
    zip.addLocalFolder(folderPath);

    // Write the ZIP file to the output directory
    zip.writeZip(zipFilePath);

    console.log(`ZIP file created successfully at: ${zipFilePath}`);
    return zipFilePath;
  } catch (error) {
    console.error(`Error creating ZIP file: ${(error as Error).message}`);
    throw error;
  }
};

