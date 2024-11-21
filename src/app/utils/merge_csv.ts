import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import { parse } from 'json2csv';

/**
 * Merges multiple CSV files into one and ensures proper row alignment.
 *
 * @param {string[]} csvFilePaths - Array of paths to CSV files to be merged.
 * @param {string} outputFilePath - Path for the merged CSV output file.
 * @returns {Promise<string>} - Path to the merged CSV file.
 * @throws {Error} - Throws an error if any file operation fails.
 */
export const mergeCsvFiles = async (csvFilePaths: string[], outputFilePath: string): Promise<string> => {
    try {
      const mergedRows: any[] = [];
      let headers: string[] | undefined;
  
      for (const filePath of csvFilePaths) {
        if (!fs.existsSync(filePath)) {
          throw new Error(`File not found: ${filePath}`);
        }
  
        const fileRows: any[] = [];
        await new Promise<void>((resolve, reject) => {
          fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (row) => fileRows.push(row))
            .on('end', () => {
              if (!headers) {
                headers = Object.keys(fileRows[0]);
              } else {
                const currentHeaders = Object.keys(fileRows[0]);
                if (JSON.stringify(headers) !== JSON.stringify(currentHeaders)) {
                  reject(new Error(`CSV file headers mismatch in ${filePath}`));
                }
              }
              mergedRows.push(...fileRows);
              resolve();
            })
            .on('error', (error) => {
              if (error instanceof Error) {
                reject(error);
              } else {
                reject(new Error('An unknown error occurred while reading the CSV file.'));
              }
            });
        });
      }
  
      if (!headers) {
        throw new Error('No headers found in the provided CSV files.');
      }
  
      // Convert merged rows to CSV format
      const mergedCsv = parse(mergedRows, { fields: headers });
  
      // Write merged data to output file
      fs.writeFileSync(outputFilePath, mergedCsv, 'utf8');
  
      console.log(`Merged CSV file created at: ${outputFilePath}`);
      return outputFilePath;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error merging CSV files: ${error.message}`);
        throw error;
      } else {
        console.error('Unknown error occurred during CSV merging.');
        throw new Error('An unknown error occurred.');
      }
    }
  };