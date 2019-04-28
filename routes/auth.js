const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const crypto = require("crypto");
const helpers = require("../helpers/functions");
const mailer = require("../helpers/mailer");

router.get("/login", (req, res) => {
  let err = req.flash("error")[0];
  res.render("auth/auth-form", {
    login: true,
    err
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Account not verified or user and password incorrect"
  }),
  (req, res) => {
    // ITS A MUST TO SAVE BEFORE REDIRECTING, ASYNCHRONOUS PROCESSING DOESNT
    // WAIT FOR THE SESSION TO SAVE
    req.session.save(() => {
      if (req.user.role === "ADMIN") res.redirect("/admprivate");
      else res.redirect("/dashboard");
    });
  }
);

router.get("/register", (req, res, next) => {
  res.render("auth/auth-form");
});

router.post("/register", (req, res, next) => {
  let { password, passwordConfirm, ...newUser } = req.body;
  if (password !== passwordConfirm) {
    return res.render("auth/auth-form", {
      err: "Passwords aren't the same"
    });
  }
  // we generate token for verification
  const randomToken = crypto.randomBytes(25).toString("hex");
  newUser = { ...newUser, confirmationCode: randomToken };
  User.register(newUser, password)
    .then(user => {
      let options = {
        email: newUser.email,
        subject: "TapCar Ads - Email verification",
        user: newUser.username,
        confirmationUrl: `${req.headers.origin}/auth/confirm/${randomToken}`
      };
      options.filename = "confirmation";

      mailer
        .send(options)
        .then(() => {
          res.redirect("/auth/login");
        })
        .catch(err => {
          res.redirect("/auth/login");
        });
    })
    .catch(err => {
      res.render("auth/auth-form", err.message);
    });
});

router.get("/logout", helpers.isAuth, (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/confirm/:code", (req, res) => {
  let { code } = req.params;
  User.findOne({ confirmationCode: code })
    .then(user => {
      let { _id } = user;
      User.findByIdAndUpdate(_id, { $set: { active: true } }).then(user => {
        res.render("auth/confirmed");
      });
    })
    .catch(err => {
      res.render("auth/register", { err: "Something went wrong" });
    });
});

module.exports = router;