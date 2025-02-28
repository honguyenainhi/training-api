const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
// Get all users

router.post("/", async (req, res) => {
  try {
    const { author, title, content} = req.body;
    const user = await User.findById(author);
    if (!user){
      res.status(404).json({ message: err.author });

    } 

    const newPost = new Post({ author, title, content, status : true });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// //createdAt
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author", ["name", "email"]);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// //updateAt
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      await post.deleteOne();
      res.json({ message: "post deleted" });
    } else {
      res.status(404).json({ message: "post not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;