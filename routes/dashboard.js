const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");

router.get("/", helpers.isAuth, helpers.checkRoles("PUBLICIST","/dashboard"), (req, res) => {
  const { user } = req;
  res.render("private/dashboard", { user });
});

module.exports = router;