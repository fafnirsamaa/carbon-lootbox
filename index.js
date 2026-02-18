const http = require("http");
const fs = require("fs");
const path = require("path");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const publicDir = path.join(__dirname, "public");
  const pagesDir = path.join(publicDir, "pages");
  let filePath;

  if (req.url === "/" || req.url === "/index.html") {
    filePath = path.join(pagesDir, "index.html");
  } else if (/^\/page\d+\.html$/.test(req.url)) {
    filePath = path.join(pagesDir, path.basename(req.url));
  } else {
    filePath = path.join(publicDir, req.url);
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentTypeMap = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
  };
  const contentType = contentTypeMap[ext] || "text/plain; charset=utf-8";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("404 Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("500 Internal Server Error");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    }
  });
});

server.listen(port, () => {
  console.log(`Dev server running at http://localhost:${port}`);
});


