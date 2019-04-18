const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const uploader = require("../helpers/multer");
const helpers = require("../helpers/functions");

// router.get("/", (req, res) => {
//   const { user } = req;
//   Campaign.find()
//     .limit(20)
//     .then(campaigns => {
//       res.render("campaigns", { campaigns, user });
//     });
// });



router.get("/new", helpers.isAuth, (req, res) => {
  const { user } = req;
  res.render("private/new-campaign", { user });
});

router.post("/new", helpers.isAuth, uploader.array("images"), (req, res) => {
  let images = req.files.map(file => file.url);
  let { _id: owner } = req.user;
  let { lat, lng, address, ...property } = req.body;
  let zones = { address, coordinates: [lat, lng] };
  campaign = { ...campaign, ads, owner, zones };
  Campaign.create(campaign)
    .then(() => {
      res.redirect("/dashboard");
    })
    .catch(err => {
      res.render("new-campaign", { err });
    });
});

router.get("/:id/edit", (req, res) => {
  const { id } = req.params;
  const { user } = req;
  Campaign.findById(id).then(campaign => {
    res.render("new-campaign", { user, campaign });
  });
});

router.post(
  "/:id/edit",
  helpers.isAuth,
  uploader.array("ads"),
  (req, res) => {
    const { id } = req.params;
    const { lat, lng, address, ...property } = req.body;
    let zones = { address, coordinates: [lat, lng] };
    Campaign.findByIdAndUpdate(id, { $set: { ...property, zones } }).then(
      () => {
        res.redirect("/dashboard");
      }
    );
  }
);

module.exports = router;