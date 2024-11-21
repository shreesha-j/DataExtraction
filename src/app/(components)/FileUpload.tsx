"use client";

import { useState } from "react";
import JSZip from "jszip";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store"; // Adjust the path as necessary
import { setInZip, setFileName, setStoredPath, resetFileState } from "../store/fileSlice";

export const FileUpload: React.FC = () => {
  const dispatch = useDispatch();
  const { inZip, fileName, storedPath } = useSelector((state: RootState) => state.file);

  const [file, setFile] = useState<File | null>(null);
  const [fileEnter, setFileEnter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zipContent, setZipContent] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // New state for progress

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    setFileEnter(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setFileEnter(false);

    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === "file") {
          const droppedFile = item.getAsFile();
          if (droppedFile) {
            handleFile(droppedFile);
          }
        }
      });
    } else {
      [...e.dataTransfer.files].forEach((droppedFile) => {
        handleFile(droppedFile);
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (selectedFile: File) => {
    setError(null);

    // Validate file type
    if (!(selectedFile.type === "application/zip" || selectedFile.name.endsWith(".zip"))) {
      setError("Please upload a valid ZIP file.");
      return;
    }

    setFile(selectedFile);
    dispatch(setInZip(true));
    dispatch(setFileName(selectedFile.name));

    setLoading(true);
    setUploadProgress(0); // Reset progress

    try {
      // Preview ZIP contents
      const zip = new JSZip();
      const contents = await zip.loadAsync(selectedFile);
      const fileNames = Object.keys(contents.files);
      setZipContent(fileNames);

      // Prepare form data
      const formData = new FormData();
      formData.append("zipFile", selectedFile);

      // Upload the ZIP file using XMLHttpRequest for progress tracking
      const xhr = new XMLHttpRequest();

      xhr.open("POST", "/api/uploadZip", true);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(percentCompleted);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          const data = JSON.parse(xhr.responseText);
          if (data.success && data.path) {
            dispatch(setStoredPath(data.path));
          } else {
            setError(data.error || "Failed to upload the ZIP file.");
            dispatch(resetFileState());
          }
        } else {
          setError("Failed to upload the ZIP file.");
          dispatch(resetFileState());
        }
        setLoading(false);
      };

      xhr.onerror = () => {
        setError("An error occurred while uploading the ZIP file.");
        dispatch(resetFileState());
        setLoading(false);
      };

      xhr.send(formData);
    } catch (uploadError) {
      console.error("Upload Error:", uploadError);
      setError("An error occurred while uploading the ZIP file.");
      dispatch(resetFileState());
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!storedPath) return;

    setLoading(true);
    setError(null);
    setUploadProgress(0); // Reset progress

    try {
      const response = await fetch("/api/deleteZip", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filePath: storedPath }),
      });

      const data = await response.json();

      if (data.success) {
        // Reset local state and Redux store
        setFile(null);
        setZipContent([]);
        dispatch(resetFileState());
      } else {
        setError(data.message || "Failed to delete the ZIP file.");
      }
    } catch (deleteError) {
      console.error("Delete Error:", deleteError);
      setError("An error occurred while deleting the ZIP file.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container px-4 max-w-5xl mx-auto">
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`${
            fileEnter ? "border-4 border-blue-500" : "border-2 border-gray-300"
          } mx-auto bg-white flex flex-col w-full max-w h-72 border-dashed items-center justify-center rounded-2xl cursor-pointer`}
          onClick={() => document.getElementById("fileInput")?.click()}
        >
          <label
            htmlFor="fileInput"
            className="h-full flex flex-col justify-center text-center text-gray-900"
          >
            Click to upload or drag and drop
          </label>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".zip"
          />
        </div>
      ) : (
        <div className="mx-auto bg-white flex flex-col w-full max-w h-72 border-dashed items-center justify-center rounded-2xl relative">
          {inZip && (
            <div className="flex justify-between items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" color="black" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}><path d="M10 12v-1m0 7v-2m0-9V6m4-4v4a2 2 0 0 0 2 2h4"></path><path d="M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01"></path><circle cx={10} cy={20} r={2}></circle></g></svg>
              <h3 className="text-lg font-semibold text-gray-700 truncate">
                ZIP File: {fileName}
              </h3>
            </div>
          )}

          <button
            onClick={handleReset}
            className="px-4 mt-10 uppercase py-2 tracking-widest outline-none bg-red-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Processing..." : "Reset"}
          </button>

          {error && <p className="text-red-500 mt-2">{error}</p>}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-gray-200 rounded-full mt-4">
              <div
                className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                style={{ width: `${uploadProgress}%` }}
              >
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      )}

      {/* Terminal-like fixed box for ZIP contents */}
      <div className="bg-gray-900 text-white mt-10 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">File Contents</h2>
        <div className="bg-black p-3 rounded-md h-40 overflow-y-auto">
          {loading ? (
            <p className="text-green-400">Loading ZIP contents...</p>
          ) : zipContent.length > 0 ? (
            <ul className="text-sm font-mono">
              {zipContent.map((content, index) => (
                <li key={index} className="py-1">
                  {content}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nothing to preview.</p>
          )}
        </div>
      </div>
    </div>
  );
};
