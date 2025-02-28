const express = require("express");
require("dotenv").config();
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Connect to MongoDB
require("./config/connect-db");

app.use('/api/users', require('./routes/users'));
app.use('/api/post', require('./routes/post'));

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
