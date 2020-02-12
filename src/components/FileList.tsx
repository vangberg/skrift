import React, { useEffect, useState } from "react";
//import fs from "fs";

export const FileList: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<string[]>([]);

  useEffect(() => {
    // fs.readdir("~/Documents/zettelkasten", (err, files) => {
    //   if (err) {
    //     setError(err.message);
    //     return;
    //   }
    //   setFiles(files);
    // });
  });

  return (
    <ul>
      {files.map(file => (
        <li>{file}</li>
      ))}
    </ul>
  );
};
