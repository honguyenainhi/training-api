require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
// connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://new:nhi123@cluster0.ngrd8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
//routes import
app.use("/api/users", require("./routes/user"));
app.use("/api/profiles", require("./routes/profile"));
app.use("/api/admin", require("./routes/admin"));
// cong thong cho server
app.listen(3001, () => console.log("Server running on port 3001"));
