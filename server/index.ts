import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.get("/", (_req, res) => {
    res.sendFile(path.join(staticPath, "home.html"));
  });
  app.use(express.static(staticPath));

  // Match the Vercel static landing rewrite for local/Node production serving.
  app.get("/instagram", (_req, res) => {
    res.sendFile(path.join(staticPath, "instagram.html"));
  });

  app.get("/workouts/groups", (_req, res) => {
    res.sendFile(path.join(staticPath, "group-workouts.html"));
  });

  // Non-home routes must use the generic shell, not the root snapshot.
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "app.html"));
  });

  const port = process.env.PORT || 3000;

  server.listen(Number(port), "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
