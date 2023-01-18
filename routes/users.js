const router = require("express").Router();
const User = require("../models/User");

// renew user !!
router.put("./:id", async (req, res) => {
    if (res.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            res.status(200).json("Updated user")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can edit only your account");
    }
})

// delete user !!
router.delete("./:id", async (req, res) => {
    if (res.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Deleted user")
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(403).json("You can delete only your account")
    }
})

// get user information !!
router.get("./:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updateAt, ...other } = user._doc;
        res.status(200).json(other)
    } catch (err) {
        return res.status(500).json(err)
    }
})


// follow user !!
router.put("./:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId,
                    }
                })
                await currentUser.updateOne({
                    $push: {
                        following: req.params.id,
                    }
                })
                return res.status(200).json("You followed this user")
            } else {
                return res.status(403).json("You are already following this user")
            }

        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(500).json("You cannot follow youself")
    }

})

// unfollow user !!
router.put("./:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId,
                    }
                })
                await currentUser.updateOne({
                    $pull: {
                        following: req.params.id,
                    }
                })
                return res.status(200).json("You unfollowed this user")
            } else {
                return res.status(403).json("You cannot unfollow this user")
            }
        } catch (err) {
            return res.status(500).json(err)
        }
    } else {
        return res.status(500).json("You cannot unfollow youself")
    }

})


// router.get("/",(req,res)=>{
//     res.send("User")
// })

module.exports = router;