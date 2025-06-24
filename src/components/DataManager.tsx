'use client';

import React, { useState } from 'react';
import { downloadData, importData, generateShareCode, importFromShareCode } from '@/utils/dataManager';

interface DataManagerProps {
  onDataImported: () => void;
}

const DataManager: React.FC<DataManagerProps> = ({ onDataImported }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [shareCode, setShareCode] = useState('');
  const [importCode, setImportCode] = useState('');
  const [message, setMessage] = useState('');

  const handleDownload = () => {
    downloadData();
    setMessage('Data exported successfully!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleGenerateShareCode = () => {
    const code = generateShareCode();
    setShareCode(code);
    navigator.clipboard.writeText(code);
    setMessage('Share code copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleImportFromCode = () => {
    if (importFromShareCode(importCode)) {
      setMessage('Data imported successfully!');
      onDataImported();
      setImportCode('');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage('Failed to import data. Please check the share code.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        if (importData(content)) {
          setMessage('Data imported successfully!');
          onDataImported();
        } else {
          setMessage('Failed to import data. Please check the file format.');
        }
        setTimeout(() => setMessage(''), 3000);
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        title="Data Management"
      >
        📊
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Data Management</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm">
            {message}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Export Data</h3>
            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              Download Data File
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Share with Friends</h3>
            <button
              onClick={handleGenerateShareCode}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mb-2"
            >
              Generate Share Code
            </button>
            {shareCode && (
              <textarea
                value={shareCode}
                readOnly
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-xs"
                placeholder="Share code will appear here"
              />
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-2">Import Data</h3>
            <div className="space-y-2">
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <div className="text-center text-gray-500 text-sm">or</div>
              <input
                type="text"
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                placeholder="Paste share code here"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <button
                onClick={handleImportFromCode}
                disabled={!importCode.trim()}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors disabled:bg-gray-400"
              >
                Import from Share Code
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 rounded-lg text-xs">
          <strong>Note:</strong> Share codes contain all your data. Only share with trusted friends.
        </div>
      </div>
    </div>
  );
};

export default DataManager;