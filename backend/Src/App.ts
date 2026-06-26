import newsRoutes from "./routes/newsRoutes"
import { config } from "./Config/env";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors({
  origin: [
    "https://newsglobe.vercel.app", 
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

// Logger now runs BEFORE routes, so every request — including 404s — gets logged
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url); 
  next();
});

app.use("/api/news", newsRoutes);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${config.PORT}`)
});