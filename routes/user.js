require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const { validateToken } = require("../validateToken");

//registering a user
router.post("/register", async (req, res) => {
  try {
    let { username, password, email } = req.body;
    const newUser = {
      username,
      password,
      email,
    };
    await User.create(newUser);
    console.log("user registered");
    res.status(200).send("ok");
  } catch (e) {
    res.status(403).json({ msg: e });
  }
});

//updating user password
router.post("/reset-pass/:username", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    let { oldPassword, newPassword } = req.body;
    if (user) {
      // checkPass=await bcrypt.compare(user.password,oldPassword)
      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (err) {
          res.status(403).json({ msg: err });
        }

        if (isMatch) {
          user.password = newPassword;
          let msg = {
            username: user.username,
            msg: "Password successfully changed",
          };
          res.status(200).json(msg);
        } else {
          res.status(403).json({ msg: "Password does not match" });
        }
      });
    }
  } catch (e) {
    console.log(e);
  }
});

//deleteing user
router.delete("/delete-user/:username", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      let delUser = await User.findByIdAndDelete(user.id);
      let msg = {
        username: user.username,
        msg: `${delUser.username} is successfully deleted`,
      };
      res.status(200).json(msg);
    }
    res.status(403).json({ msg: `user does not exist!` });
  } catch (e) {
    res.status(403).json({ msg: e });
  }
});

//get  a  user-detail
router.get("/:username", validateToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.status(200).send({
        data: user,
        user: user.username,
      });
    } else {
      res.status(403).json({ msg: "User does not exist" });
    }
  } catch (e) {
    res.status(403).json({ msg: e });
  }
});

//check if user exists
router.get("/checkuser/:username", async (req, res) => {
  try {
    console.log("yo");
    const user = await User.findOne({ username: req.params.username });
    if (user) {
      res.status(200).json({
        status: true,
      });
    } else {
      res.status(200).json({
        status: false,
      });
    }
  } catch (e) {
    res.status(500).json({ msg: e });
  }
});
//logging in user
router.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(403).json({ msg: err });
        }

        if (isMatch) {
          token = jwt.sign({ username }, process.env.JWT_SEC, {
            expiresIn: "24h",
          });
          return res.status(200).json({
            token,
            msg: "user token generated",
          });
        } else {
          res.status(403).json({ msg: "Password does not match" });
        }
      });
    } else {
      res.status(403).json({ msg: "User does not exist" });
    }
  } catch (e) {
    res.status(403).json({ msg: e });
  }
});
module.exports = router;
