const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const campaignSchema = new Schema({
  campaignName: {
    type: String,
    required: true
  },
  zone:{
    type:Schema.Types.ObjectId,
    ref: "Zone"
  },
  startDate:{
    type: Date,
    required: true
  },
  endDate:{
    type: Date,
    required: true
  },
  playsPerHour:{
    type: Number,
    required: true,
  },
  ads:{
    type: [String],
  },
  owner:{
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User"
  }
  
}, { timestamps: true }
);

module.exports = mongoose.model('Campaign', campaignSchema)

