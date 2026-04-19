import express from "express";
import cors from "cors";
import multer from "multer";
import dotenv from "dotenv";


const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(multer().none());
dotenv.config()

// Routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.get("/test", (req, res) => {
  res.send("Hello World!");
});

export default app;