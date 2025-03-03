const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRouter = require("./routes/admin");

dotenv.config();

const app = express();
app.use(express.json());
// Init mongoose
const mongoURI = process.env.MONGO_URI;
// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.error(err));

app.use("/api/admin", adminRouter);
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
