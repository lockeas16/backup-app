const express = require('express');
const router = express.Router();

router.get("/",(req,res)=>{
  res.render("private/zones");
});

router.get("/new",(req,res)=>{
  res.render("private/zone-form");
});

module.exports = router;