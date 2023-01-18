const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savePost = await newPost.save();
        return res.status(200).json(savePost);
    } catch (err) {
        return res.status(500).json(err);
    }
})

// update post
router.post("/id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            })
            return res.status(200).json("You edited the post")
        } else {
            return res.status(403).json("You cannot edit other people's post")
        }
    } catch (err) {
        return res.status(403).json(err);
    }
})

// delete post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne({
                $set: req.body,
            })
            return res.status(200).json("You deleted the post")
        } else {
            return res.status(403).json("You cannot delete other people's post")
        }
    } catch (err) {
        return res.status(500).json(err);
    }
})

// get post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post)
    } catch (err) {
        return res.status(500).json(err);
    }
})

// like!!
router.put("./:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const currentUser = await Post.findById(req.body.userId);

        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId,
                }
            })
            return res.status(200).json("You like this post")
        } else {
            await post.updateOne({
                $pull: {
                    likes: req.body.userId,
                }
            })
            return res.status(403).json("You don't like this post")
        }

    } catch (err) {
        return res.status(500).json(err)
    }
})

// get timeline
router.get("./timeline/all", async (req, res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        const userPosts = await Post.find({ userId: currentUser._id });
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId});
            })
        );
        return res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        return res.status(500).json(err);
    }
})

// router.get("/",(req,res)=>{
//     res.send("Posts");
// });

module.exports = router;