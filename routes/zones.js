const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");
const Zone = require("../models/Zone");

router.use(helpers.isAuth);

router.get("/", (req, res) => {
  res.render("private/zones");
});

router.get("/new", (req, res) => {
  res.render("private/zone-form");
});

router.post("/new", (req, res) => {
  const { name, coords } = req.body;
  const { user } = req;
  const newZone = {
    name,
    owner: user._id,
    area: {
      type: "Polygon",
      coordinates: coords
    }
  };
  console.log(newZone.area.coordinates);
  Zone.create(newZone)
    .then(zone => {
      res.status(201).json(zone);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id/detail", (req, res) => {
  let { id } = req.params;
  Zone.findById(id)
    .then(zone => {
      res.render("private/zone", zone);
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
