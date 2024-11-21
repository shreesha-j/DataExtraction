"use client";
import { useState } from "react";

export const CSVUpload: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [fileContents, setFileContents] = useState<Record<string, string[]>>({});
  const [fileEnter, setFileEnter] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); // For vertical pagination

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
      const droppedFiles = [...e.dataTransfer.items]
        .map((item) => item.getAsFile())
        .filter((file) => file && file.name.endsWith(".csv")) as File[];
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      } else {
        alert("Please upload valid CSV files.");
      }
    } else {
      const droppedFiles = [...e.dataTransfer.files].filter((file) =>
        file.name.endsWith(".csv")
      );
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      } else {
        alert("Please upload valid CSV files.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : [];
    const csvFiles = newFiles.filter((file) => file.name.endsWith(".csv"));
    if (csvFiles.length > 0) {
      handleFiles(csvFiles);
    } else {
      alert("Please upload valid CSV files.");
    }
  };

  const handleFiles = (newFiles: File[]) => {
    setLoading(true);

    const updatedFiles = [...files];
    const newFileContents: Record<string, string[]> = {};

    newFiles.forEach((file) => {
      if (!files.find((existingFile) => existingFile.name === file.name)) {
        updatedFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          const rows = content.split("\n");
          newFileContents[file.name] = rows;
          setFileContents((prev) => ({ ...prev, ...newFileContents }));
        };
        reader.readAsText(file);
      }
    });

    setFiles(updatedFiles);
    setLoading(false);
  };

  const resetAllFiles = () => {
    setFiles([]);
    setFileContents({});
    setCurrentIndex(0);
  };

  const goToNextFile = () => {
    if (currentIndex < files.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPreviousFile = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="container px-4 items-center max-w-5xl">
      {/* Drag and Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center h-72 border-dashed rounded-lg ${
          fileEnter ? "border-4 border-blue-400 bg-blue-50" : "border-2 border-gray-300 bg-gray-50"
        }`}
      >
        <input
          id="file"
          type="file"
          accept=".csv"
          multiple
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 text-gray-400 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4l2-2h6a2 2 0 0 1 2 2v2"></path>
            <path d="M16 18h1a2 2 0 0 0 2-2v-1"></path>
            <path d="M8 14h.01"></path>
            <path d="M12 14h.01"></path>
            <path d="M8 18h.01"></path>
            <path d="M12 18h.01"></path>
          </svg>
          <p className="text-sm text-gray-500">
            Drag and drop your CSV files here, or{" "}
            <label htmlFor="file" className="text-blue-500 cursor-pointer underline">
              browse
            </label>
          </p>
        </div>
      </div>

      {/* File Preview Section */}
      <div className="mt-10">
        {files.length === 0 ? (
          <p className="text-gray-500 text-center">No files uploaded.</p>
        ) : (
          <div className="bg-gray-900 text-white mt-4 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <button
                onClick={goToPreviousFile}
                className={`px-3 py-1 bg-blue-500 text-white rounded-md ${
                  currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentIndex === 0}
              >
                {"<"}
              </button>
              <h2 className="text-xl font-semibold">
                {files[currentIndex]?.name || "Unknown File"}
              </h2>
              <button
                onClick={goToNextFile}
                className={`px-3 py-1 bg-blue-500 text-white rounded-md ${
                  currentIndex === files.length - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={currentIndex === files.length - 1}
              >
                {">"}
              </button>
            </div>
            <div className="bg-black p-3 rounded-md h-40 overflow-y-auto mt-4">
              {loading ? (
                <p className="text-green-400">Loading...</p>
              ) : fileContents[files[currentIndex]?.name]?.length > 0 ? (
                <ul className="text-sm font-mono">
                  {fileContents[files[currentIndex]?.name]?.map((content, index) => (
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
        )}
        {files.length > 0 && (
          <button
            onClick={resetAllFiles}
            className="px-4 py-2 bg-red-600 text-white rounded-md mt-4"
          >
            Reset All
          </button>
        )}
      </div>
    </div>
  );
};
