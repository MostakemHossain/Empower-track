import app from "./app.js";

const port = 4000;

const server = app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log("😈 unhandledRejection detected. Shutting down...");
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log("😈 uncaughtException detected. Shutting down...");
  console.log(err);

  process.exit(1);
});