const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");

router.get("/", helpers.isAuth, helpers.isAdmin, (req, res) => {
  res.render("admprivate/profile");
});

module.exports = router;
