require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const user_routes = require("./routes/user-routes");
const packages_routes = require("./routes/package-routes");
const bookingRoutes = require("./routes/booking-routes");
const { verifyUser } = require("./middlewares/auth");
const adminRoutes = require("./routes/admin-routes");
const cors = require("cors");
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DB_URI
    : process.env.DB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to mongodb database server");
  })
  .catch((err) => console.log(err));

const morgan = require("morgan");
const path = require("path");
const fs = require("fs");
const rfs = require("rotating-file-stream");

// For audit log
// Ensure the log directory exists
const logDirectory = path.join(__dirname, "logs");
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// Create a rotating write stream
const accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: logDirectory,
});

const app = express();

// Use morgan middleware with the rotating file streat for logging
app.use(morgan("combined", { stream: accessLogStream }));

app.use(cors());

app.use(express.json());
app.use(express.static("public"));

app.use("/users", user_routes);

app.use("/packages", verifyUser, packages_routes);

app.use("/booking", bookingRoutes);

app.use("/admin", adminRoutes);
app.use("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the Travel API" });
});

// Error handling middleware

app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400).json({ error: err.message });
  } else if (err.message === "File format not supported.") {
    res.status(400).json({ error: err.message });
  } else {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Unknown Path
app.use((req, res) => {
  res.status(404).json({ error: "Path Not Found" });
});

module.exports = app;
