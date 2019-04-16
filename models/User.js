const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// traermos passport-local-mongoose
const passportLocalMongoose = require("passport-local-mongoose");
const userSchema = new Schema(
  {
    username: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    lastname: {
      type: String
    },
    role: {
      type: String,
      required: true,
      enum: ["ADMIN", "PUBLICIST"],
      default: "PUBLICIST"
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    image: {
      type: String
    },
    confirmationCode: {
      type: String,
      unique: true
    },
    active: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  hashField: "password",
  // function to query only active users on authenticate
  findByUsername: function(model, queryParameters) {
    // Add additional query parameter - AND condition - active: true
    queryParameters.active = true;
    return model.findOne(queryParameters);
  }
});
module.exports = mongoose.model("User", userSchema);
