const express = require("express");
const router = express.Router();
const Campaign = require("../models/Campaign");
const uploader = require("../helpers/multer");
const helpers = require("../helpers/functions");
const Zone = require("../models/Zone");
const moment = require("moment-timezone");

router.use(helpers.isAuth);
router.use(helpers.checkRoles("PUBLICIST"));
router.use(helpers.storeUrl);

router.get("/new", (req, res) => {
  const { user } = req;
  const { id } = req.user;
  Zone.find({ owner: id }, "_id, name").then(zones => {
    res.render("private/new-campaign", { user, zones });
  });
});

router.post("/new", uploader.array("ads"), (req, res) => {
  let ads = req.files.map(file => file.url);
  let { _id: owner } = req.user;
  let campaign = req.body;
  campaign = { ads, owner, ...campaign };
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
  Campaign.findById(id).then(camp => {
    let campaign = {
        _id: camp._id,
        campaignName: camp.campaignName,
        zone: camp.zone,
        startDate: moment(camp.startDate).utc().format("YYYY-MM-DD"),
        endDate: moment(camp.endDate).utc().format("YYYY-MM-DD"),
        playsPerHour: camp.playsPerHour,
        ads: camp.ads,
        owner: camp.owner
    }
    Zone.find({ owner: user._id }, "_id, name").then(zones => {
      res.render("private/new-campaign", { user, campaign, zones });
    });
  });
});

router.post("/:id/edit", uploader.array("ads"), (req, res) => {
  const { id } = req.params;
  const { campaignName } = req.body;
  Campaign.findByIdAndUpdate(id, { $set: { campaignName } }).then(() => {
    res.redirect("/dashboard");
  });
});

module.exports = router;