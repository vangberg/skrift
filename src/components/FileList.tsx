import React, { useEffect, useState } from "react";
import fs from "fs";
import os from "os";
import path from "path";

export const FileList: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    const dir = path.join(os.homedir(), "Documents", "zettelkasten");
    fs.readdir(dir, (err, files) => {
      if (err) {
        setError(err.message);
        return;
      }
      setFiles(files);
    });
  });

  if (error) {
    return <div className="border border-red-500">Error: {error}</div>;
  }

  return (
    <ul>
      {files.map(file => (
        <li key={file}>{file}</li>
      ))}
    </ul>
  );
};
