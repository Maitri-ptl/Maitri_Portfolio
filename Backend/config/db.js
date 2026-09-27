const mongoose = require('mongoose');

// Connects to MongoDB using the URI from .env.
// Called once when the server starts (see server.js).
// If the connection fails we exit the process — there's no point running
// an API that can't reach its database.
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
