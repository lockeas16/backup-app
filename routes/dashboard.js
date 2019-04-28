const express = require("express");
const router = express.Router();
const helpers = require("../helpers/functions");
const Campaign = require("../models/Campaign");
const uploader = require("../helpers/multer");
const User = require("../models/User");
const moment = require("moment-timezone");

router.get(
  "/",
  helpers.isAuth,
  helpers.checkRoles("PUBLICIST", "/dashboard"),
  (req, res) => {
    const { user } = req;
    Campaign.find({ owner: user._id }).then(camps => {
      const currentDate = new Date(moment().format());

      // Creating a new campaign object and formatting dates
      let campaigns = camps.map(campaign => {
        const endCampDate = new Date(
          moment(campaign.endDate)
            .utc()
            .format()
        );
        const stillActive = currentDate > endCampDate ? false : true;

        // update status to inactive if campaign was active
        if (!stillActive && campaign.active) {
          Campaign.findByIdAndUpdate(campaign._id, { $set: { active: false } })
            .then(camp => {
              console.log(`Campaign ${camp._id} inactivated due dates`);
            })
            .catch(err => {
              console.log(
                `An error ocurred during inactivation of campaign ${camp._id}`
              );
              console.log(err);
            });
        }

        return {
          _id: campaign._id,
          campaignName: campaign.campaignName,
          zone: campaign.zone,
          startDate: moment(campaign.startDate)
            .utc()
            .format("DD-MM-YYYY"),
          endDate: moment(campaign.endDate)
            .utc()
            .format("DD-MM-YYYY"),
          playsPerHour: campaign.playsPerHour,
          ads: campaign.ads,
          owner: campaign.owner,
          status: stillActive === true ? "Active" : "Inactive"
        };
      });
      res.render("private/dashboard", { user, campaigns });
    });
  }
);

router.get("/:id/edit", helpers.isAuth, (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .then(user => {
      res.render("auth/auth-form", { user });
    })
    .catch(err => {
      res.render("auth/auth-form", { err });
    });
});

router.post(
  "/:id/edit",
  helpers.isAuth,
  uploader.single("image"),
  (req, res) => {
    const { id: _id } = req.params;
    const {name, lastname} = req.body;
    let user = {name, lastname};
    if (req.file){
      const { url: image } = req.file;
      user = { ...user, image };
    }
    User.findByIdAndUpdate({ _id }, { $set: user })
      .then(() => {
        res.redirect("/dashboard");
      })
      .catch(err => {
        console.log(err);
        res.redirect("/dashboard");
      });
  }
);

module.exports = router;
