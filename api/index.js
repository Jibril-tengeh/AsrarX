import express from "express";
import cors from "cors";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    service: "AsrarHub Serverless Backend API",
    status: "online",
    deployment: "Vercel Serverless (Backend Only)",
    frontendHost: "GitHub",
    version: "1.2.0"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AsrarHub Backend",
    platform: "Vercel Serverless",
    timestamp: Date.now()
  });
});

export default app;
