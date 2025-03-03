require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

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
//routes
app.use("/api/products", require("./routes/product"));
// app.use("/api/orders", require("./routes/order"));

app.listen(3003, () => console.log("Server running on port 3003"));
