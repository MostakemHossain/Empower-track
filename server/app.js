import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./router/index.js";
import cookieParser from "cookie-parser";
import globalErrorHandler from "./middlewares/global-error-handler.js";
import notFound from "./middlewares/not-found.js";

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

app.use(globalErrorHandler);
app.use(notFound);

export default app;