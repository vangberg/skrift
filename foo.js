const fs = require("fs");

const t1 = new Date();
fs.readdir(
  "/Users/harry/work/10000-markdown-files/10000 markdown files",
  (err, fns) => {
    const t2 = new Date() - t1;
    console.log(`Read ${fns.length} files in ${t2} ms`);
  }
);
