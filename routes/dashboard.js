const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");
const Campaign = require("../models/Campaign");
const uploader = require("../helpers/multer")
const User = require("../models/User")

router.get("/", helpers.isAuth, helpers.checkRoles("PUBLICIST","/dashboard"), (req, res) => {
  const { user } = req;
  res.render("private/dashboard", { user });
});

router.get("/dashboard", helpers.isAuth, (req, res) => {
  const { user } = req;
  Campaign.find({ owner: user._id }).then(campaigns => {
    res.render("private/dashboard", { user, campaigns });
  });
});

router.get("/:id/edit", helpers.isAuth, (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.render("auth/auth-form", { user });
    })
    .catch(err => {
      res.render("auth/auth-form", { err });
    });
});

router.post("/:id/edit", helpers.isAuth, uploader.single("image"),
  (req, res) => {
    const { id: _id } = req.params;
    console.log(req.file)
    const { email } = req.user;
    const { url: image } = req.file;
    const user = { ...req.body, image };
    User.findOneAndUpdate({ _id, email }, { $set: user })
      .then(() => {
        res.redirect("/dashboard");
      })
      .catch(err => {
        res.render("auth-form", { err });
      });
  }
);

module.exports = router;