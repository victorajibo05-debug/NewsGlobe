import newsRoutes from "./routes/newsRoutes"
import { config } from "./Config/env";
import express from "express";
import cors from "cors";

 
const app = express();

app.use(cors({
  origin: [
    "https://news-globe-five.vercel.app",  // ← your Vercel URL from earlier screenshot
    "http://localhost:5173"
  ],
  methods: ["GET", "POST"],
  credentials: true,
}));
app.use(express.json());

app.use("/api/news", newsRoutes);

app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.url); // ← add this
  next();
});

app .listen(config.PORT,() => {
    console.log(`Server is running on port ${config.PORT}`)
});