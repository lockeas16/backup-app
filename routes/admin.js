const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const helpers = require("../helpers/functions");

router.get("/login", (req, res) => {
  let err = req.flash("error")[0];
  res.render("admin/auth-form", {
    login: true,
    err
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: "User and/or password incorrect"
  }),
  helpers.isAdmin,
  (req, res) => {
    res.redirect("/admprivate");
  }
);

router.get("/register", (req, res, next) => {
  User.findOne({ role: "ADMIN" }).then(user => {
    if (!user) res.render("admin/auth-form");
    else res.redirect("/admin/login");
  });
});

router.post("/register", (req, res, next) => {
  let { password, passwordConfirm, ...newUser } = req.body;
  if (password !== passwordConfirm) {
    return res.render("admin/auth-form", {
      err: "Passwords aren't the same"
    });
  }
  // create user as ADMIN
  User.register({ role: "ADMIN", ...newUser }, password)
    .then(user => {
      res.redirect("/admin/login");
    })
    .catch(err => {
      res.render("admin/auth-form", err.message);
    });
});

router.get("/logout", helpers.isAuth, helpers.isAdmin, (req, res, next) => {
  req.logout();
  res.redirect("/admin/login");
});

module.exports = router;
