import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index.js";
import cookieParser from "cookie-parser";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
dotenv.config();
app.use(cookieParser());


app.use('/api/v1', router);

// Routes
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});



app.get("/test", (req, res) => {
  res.send("Hello World!");
});

export default app;