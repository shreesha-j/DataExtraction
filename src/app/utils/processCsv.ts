import fs from 'fs-extra';
import path from 'path';
import csvParser from 'csv-parser';

interface CsvRow {
  audio: string;
  transcription: string;
}

/**
 * Processes a CSV file to copy audio files and create transcript files.
 *
 * @param csvFilePath - Path to the input CSV file.
 * @param sourceBasePath - Base path for source files.
 * @param destinationBasePath - Base path for destination files.
 */
const processCsv = async (csvFilePath: string, sourceBasePath: string, destinationBasePath: string): Promise<void> => {
  try {
    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }

    console.log(`Processing CSV file: ${csvFilePath}`);

    // Read and process the CSV file
    const rows: CsvRow[] = [];
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row) => rows.push(row))
        .on('end', resolve)
        .on('error', reject);
    });

    for (const row of rows) {
      await processAudioFile(row, sourceBasePath, destinationBasePath);
    }

    console.log(`Finished processing CSV file.`);
  } catch (error) {
    console.error(`Error processing CSV: ${(error as Error).message}`);
  }
};

/**
 * Processes a single row from the CSV file.
 *
 * @param row - Row object containing `audio` and `transcription` fields.
 * @param sourceBasePath - Base path for source files.
 * @param destinationBasePath - Base path for destination files.
 */
const processAudioFile = async (row: CsvRow, sourceBasePath: string, destinationBasePath: string): Promise<void> => {
  try {
    // Step 1: Extract the folder path from the `audio` field (remove prefix '/data/local-files/?d=')
    const audioPath = row.audio.replace('/data/local-files/?d=', '');
    const folderPath = path.dirname(audioPath); // Get the directory path

    // Step 2: Form the full source and destination paths
    const sourceAudioPath = path.join(sourceBasePath, folderPath, 'audio.wav');
    const destinationFolderPath = path.join(destinationBasePath, folderPath);
    const destinationAudioPath = path.join(destinationFolderPath, 'audio.wav');

    console.log(`\nProcessing row: ${row.audio}`);
    console.log(`Source path: ${sourceAudioPath}`);
    console.log(`Destination path: ${destinationAudioPath}`);

    // Step 3: Create the destination folder tree if it doesn't exist
    await fs.ensureDir(destinationFolderPath);

    // Step 4: Copy the audio file if it exists
    if (await fs.pathExists(sourceAudioPath)) {
      console.log(`Copying ${sourceAudioPath} to ${destinationAudioPath}`);
      await fs.copy(sourceAudioPath, destinationAudioPath);
      console.log(`Copied successfully.`);
    } else {
      console.warn(`Source audio file does not exist: ${sourceAudioPath}`);
    }

    // Step 5: Create a `transcript.txt` file in the destination folder
    const transcriptionText = row.transcription ?? '';
    const transcriptFilePath = path.join(destinationFolderPath, 'transcript.txt');
    await fs.writeFile(transcriptFilePath, transcriptionText);
    console.log(`Created transcript file at ${transcriptFilePath}`);
  } catch (error) {
    console.error(`Error processing audio file for row ${row.audio}: ${(error as Error).message}`);
  }
};

export default processCsv;