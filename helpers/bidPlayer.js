const Campaign = require('../models/Campaign')

exports.update = (e) => {
  return Campaign.findByIdAndUpdate(e.id, {$inc: {playsPerHour: -1}},{new: true});
}
