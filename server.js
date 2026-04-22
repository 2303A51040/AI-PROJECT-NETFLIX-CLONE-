const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const profileRoute = require("./routes/profiles");

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB connection successful");
}).catch((err) => {
  console.error("DB connection error:", err);
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/profiles", profileRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON request received');
    return res.status(400).send({ message: "Invalid JSON payload" });
  }
  console.error('Unhandled Error:', err);
  res.status(500).send({ message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server is running on port ${PORT}`);
});
