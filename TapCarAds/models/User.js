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
    role:{
      type:String,
      required:true,
      enum:["ADMIN","PUBLICIST"],
      default:"PUBLICIST"
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
    }
  },
  { timestamps: true }
);

// conectar el plugin
userSchema.plugin(passportLocalMongoose, {
  // le decimos cual va a ser el email, porque toma username por defecto
  usernameField: "email",
  // le indicamos donde va a guardar el password
  hashField: "password"
});
module.exports = mongoose.model("User", userSchema);
