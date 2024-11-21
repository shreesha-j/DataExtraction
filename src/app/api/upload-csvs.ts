// File: pages/api/uploadCSVs.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';
import { UploadCSVsResponse } from '../types/fileUpload';

// Disable Next.js's default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function uploadCSVs(req: NextApiRequest, res: NextApiResponse<UploadCSVsResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Error parsing the files', err);
      return res.status(500).json({ success: false, error: 'Error parsing the files' });
    }

    const uploadedCSVs = files.csvFiles;

    if (!uploadedCSVs) {
      return res.status(400).json({ success: false, error: 'No CSV files uploaded' });
    }

    let filesArray: File[] = [];

    if (Array.isArray(uploadedCSVs)) {
      filesArray = uploadedCSVs;
    } else {
      filesArray = [uploadedCSVs];
    }

    if (filesArray.length === 0) {
      return res.status(400).json({ success: false, error: 'No CSV files uploaded' });
    }

    // Validate each file type
    for (const file of filesArray) {
      if (path.extname(file.originalFilename || '').toLowerCase() !== '.csv') {
        return res.status(400).json({ success: false, error: `Uploaded file ${file.originalFilename} is not a CSV file` });
      }
    }

    // Define the upload directory
    const uploadDir = path.join(process.cwd(), 'src', 'data', 'uploadedCSVs');

    try {
      // Ensure the upload directory exists
      fs.mkdirSync(uploadDir, { recursive: true });

      const savedPaths: string[] = [];

      for (const file of filesArray) {
        const timestamp = Date.now();
        const sanitizedFilename = file.originalFilename ? file.originalFilename.replace(/\s+/g, '_') : `uploaded_${timestamp}.csv`;
        const fileName = `${timestamp}-${sanitizedFilename}`;
        const filePath = path.join(uploadDir, fileName);

        try {
          fs.renameSync(file.filepath, filePath);
          const relativePath = `/src/data/uploadedCSVs/${fileName}`;
          savedPaths.push(relativePath);
        } catch (renameErr) {
          console.error(`Error saving file ${file.originalFilename}`, renameErr);
          return res.status(500).json({ success: false, error: `Error saving file ${file.originalFilename}` });
        }
      }

      return res.status(200).json({ success: true, paths: savedPaths });
    } catch (error) {
      console.error('Error processing the uploads', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });
}
