const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");

router.get("/", helpers.isAuth, helpers.checkRoles("PUBLICIST","/private/profile"), (req, res) => {
  res.render("private/profile");
});

module.exports = router;