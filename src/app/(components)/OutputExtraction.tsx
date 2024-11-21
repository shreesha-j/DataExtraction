"use client";
import { useState } from "react";

export const ProcessData: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleProcessData = () => {
    setProcessing(true);
    setLogs([]); // Clear previous logs

    // Simulate a data processing task with logs
    const logMessages = [
      "Initializing data processing...",
      "Loading data...",
      "Validating data...",
      "Processing row 1...",
      "Processing row 2...",
      "Saving results...",
      "Data processing complete.",
    ];

    // Simulate async log generation
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < logMessages.length) {
        setLogs((prevLogs) => [...prevLogs, logMessages[logIndex]]);
        logIndex++;
      } else {
        clearInterval(interval);
        setProcessing(false);
      }
    }, 1000); // 1-second interval between logs
  };

  return (
    <div className="container mx-auto px-4 mb-10">
      {/* Process Data Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={handleProcessData}
          className={`px-4 py-2 text-white font-semibold rounded ${
            processing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={processing}
        >
          {processing ? "Processing..." : "Process Data"}
        </button>
      </div>

      {/* Log Window */}
      <div className="mt-6 bg-gray-900 text-white rounded-lg p-4 max-w-4xl mx-auto h-60 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Logs</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs available. Click "Process Data" to start.</p>
        ) : (
          <ul className="text-sm font-mono">
            {logs.map((log, index) => (
              <li key={index} className="mb-1">
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
