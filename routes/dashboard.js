const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");

router.get("/", helpers.isAuth, helpers.checkRoles("PUBLICIST","/dashboard"), (req, res) => {
  res.render("private/dashboard");
});

module.exports = router;