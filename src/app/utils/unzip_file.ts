import fs from 'fs';
import path from 'path';
import AdmZip from 'adm-zip';

/**
 * Extracts a ZIP file to a unique directory and returns the extraction path.
 *
 * @param {string} zipFilePath - Path to the ZIP file.
 * @returns {string} - Path to the directory containing the extracted files.
 * @throws {Error} - Throws an error if the extraction fails.
 */
export const extractZipFile = (zipFilePath: string): string => {
    try {
      if (!fs.existsSync(zipFilePath)) {
        throw new Error(`File not found: ${zipFilePath}`);
      }
  
      // Generate a unique directory for extraction
      const timestamp = Date.now();
      const outputDir = path.join(process.cwd(), 'extracted', `extracted_${timestamp}`);
  
      // Create output directory if it doesn't exist
      fs.mkdirSync(outputDir, { recursive: true });
  
      // Extract the ZIP file
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(outputDir, true);
  
      console.log(`Extraction successful! Files are located at: ${outputDir}`);
      return outputDir;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error extracting ZIP file: ${error.message}`);
        throw error;
      } else {
        console.error('Unknown error occurred during ZIP extraction.');
        throw new Error('An unknown error occurred.');
      }
    }
  };