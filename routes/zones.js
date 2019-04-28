const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");
const Zone = require("../models/Zone");

router.use(helpers.isAuth);
router.use(helpers.checkRoles("PUBLICIST", "/dashboard"));

router.get("/", (req, res) => {
  const { id } = req.user;
  const { user } = req;
  // we store the url so at creation it returns here
  req.session.previousUrl = req.originalUrl;
  Zone.find({ owner: id }, "_id")
    .then(zones => {
      res.render("private/zones", { user, zones });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/new", (req, res) => {
  const { user } = req;
  // we pass the url to the view so axios can redirect to it after processing
  const { previousUrl: redirectUrl } = req.session;
  res.render("private/zone-form", { user, redirectUrl });
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
  const { id } = req.params;
  // we pass the url to the view so axios can redirect to it after processing
  const { previousUrl: redirectUrl } = req.session;
  Zone.findById(id)
    .then(zone => {
      res.render("private/zone-form", { zone, redirectUrl });
    })
    .catch(err => {
      console.log(err);
    });
});

router.get("/:id/getJSON", (req, res) => {
  const { id } = req.params;
  Zone.findById(id)
    .then(zone => {
      res.status(200).json(zone);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});

router.patch("/:id/update", (req, res) => {
  const { name, coords } = req.body;
  const { id } = req.params;
  const updatedZone = {
    name,
    area: {
      type: "Polygon",
      coordinates: coords
    }
  };
  Zone.findByIdAndUpdate(id, { $set: updatedZone })
    .then(zone => {
      res.status(200).json(zone);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id/delete", (req, res) => {
  const { id } = req.params;
  Zone.findByIdAndRemove(id)
    .then(() => {
      res.redirect("back");
    })
    .catch(err => {
      console.log(err);
      res.redirect("back");
    });
});

module.exports = router;
