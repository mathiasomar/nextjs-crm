import app from "./app";

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  process.exit(1);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`
    🚀 Server running in ${process.env.NODE_ENV} mode
    📍 Port: ${PORT}
    📅 ${new Date().toISOString()}
    🔗 Health: http://localhost:${PORT}/health
  `);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("Received shutdown signal, gracefully shutting down...");

  server.close(async () => {
    console.log("HTTP server closed");

    // Close database connections here if needed
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("Forcefully shutting down...");
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
