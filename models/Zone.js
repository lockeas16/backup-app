const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const zoneSchema = new Schema(
  {
    name:{
      type:String,
      required:true,
      unique:true
    },  
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User"
    },
    area: {
      type: {
        type: String,
        default: "Polygon"
      },
      coordinates:{
        // correct format to store polygons!
        type:[],
        required: true
      }
    }
  },
  { timestamps:true }
);

zoneSchema.index({ area: "2dsphere" });
module.exports = mongoose.model('Zone',zoneSchema)