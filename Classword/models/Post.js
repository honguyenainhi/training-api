const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  author:{
    type: mongoose.Schema.Types.ObjectId, ref: "User", required: true 
  },
  title: {
    type: String, required: true 
  },
  
  content: { 
    type: String, required: true 
  },
  status: { 
    type: Boolean, enum: ["draft", "published"], default: "draft" 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
