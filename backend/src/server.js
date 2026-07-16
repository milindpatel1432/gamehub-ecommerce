import 'dotenv/config';
import app from './app.js';
import connectDB from './database/db.js';

console.log("MONGODB_URI =", process.env.MONGODB_URI);
// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Uncaught Exceptions safety net listeners
process.on('uncaughtException', (err) => {
  console.error(`[Error] Uncaught Exception: ${err.message}`);
  console.error(err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error(`[Error] Unhandled Rejection: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
