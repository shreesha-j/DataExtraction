import fs from 'fs';
import path from 'path';

/**
 * Deletes all files and subdirectories inside a folder.
 * 
 * @param folderPath - Path to the folder whose contents should be deleted.
 * @throws {Error} - Throws an error if the folder does not exist or if the operation fails.
 */
const deleteFolderContents = (folderPath: string): void => {
  try {
    // Check if the folder exists
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    // Read all files and subdirectories inside the folder
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);

      // Check if the path is a file or a directory
      if (fs.lstatSync(filePath).isDirectory()) {
        // Recursively delete contents of subdirectory
        fs.rmdirSync(filePath, { recursive: true });
        console.log(`Deleted directory: ${filePath}`);
      } else {
        // Delete file
        fs.unlinkSync(filePath);
        console.log(`Deleted file: ${filePath}`);
      }
    }

    console.log(`All contents of the folder '${folderPath}' have been deleted.`);
  } catch (error) {
    console.error(`Error deleting folder contents: ${(error as Error).message}`);
    throw error;
  }
};