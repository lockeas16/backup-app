const Campaign = require('../models/Campaign')

exports.update = (e) => {
  return Campaign.findOneAndUpdate(e._id, {$inc: {playsPerHour: -1}},{new: true});
}
