// File: src/types/fileUpload.ts

export interface UploadZipResponse {
    success: boolean;
    path?: string;
    error?: string;
  }
  
  export interface UploadCSVsResponse {
    success: boolean;
    paths?: string[];
    error?: string;
  }
  