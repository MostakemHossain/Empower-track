import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(multer().none());

// Routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

export default app;