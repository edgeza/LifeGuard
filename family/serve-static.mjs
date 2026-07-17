// Minimal static-file server for the built family pages.
// Reads .next/server/app/<route>.html and serves them on http://localhost:3001
// plus the .next/static assets. This exists only because Next 14.2.35 fails to
// write a runtime prerender-manifest.json after a successful build.

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { join, extname, resolve } from "node:path";

const ROOT = resolve(".");
const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".woff2":"font/woff2",
  ".txt":  "text/plain; charset=utf-8",
};

async function read(p) { return readFile(p); }

const server = createServer(async (req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);

  // Map URL → built HTML file in .next/server/app/
  let htmlPath;
  if (urlPath === "/" || urlPath === "") htmlPath = "index.html";
  else htmlPath = urlPath.replace(/^\//, "") + ".html";

  const abs = join(ROOT, ".next", "server", "app", htmlPath);
  try {
    const data = await readFile(abs);
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(data);
  } catch (e1) {
    // Try next/static assets
    const alt = join(ROOT, ".next", urlPath);
    try {
      const data = await readFile(alt);
      const ext = extname(urlPath).toLowerCase();
      res.writeHead(200, { "content-type": TYPES[ext] || "application/octet-stream" });
      res.end(data);
    } catch (e2) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("Not found: " + urlPath);
    }
  }
});

server.listen(PORT, () => console.log(`Static server: http://localhost:${PORT}/`));
