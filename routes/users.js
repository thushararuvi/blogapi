const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");

//update
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      if (req.body.password) {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body
        },
        { new: true }
      );

      const { password, ...others } = updatedUser._doc;

      res.status(200).json(others);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(401).json("You can only update your account!");
  }
});

//delete
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      console.log(req.params.id);
      const user = await User.findbyId(req.params.id);

      try {
        await Post.deleteMany({ username: user.username });

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(401).json("User not found");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

// get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
