require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const logger = require("morgan");
const path = require("path");
// for sessions
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const passport = require("./helpers/passport");
const flash = require("connect-flash");

mongoose
  .connect(process.env.DB, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
    // for deprecation warning collection.findAndModify is deprecated
    mongoose.set('useFindAndModify', false);
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// to use flash messages
app.use(flash());

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    // duracion de la sesion - 1 hora
    cookie: { maxAge: 3600000 },
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60 // 1 day
    })
  })
);

// siempre debajo de la configuracion de la sesion
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
// registramos partials
hbs.registerPartials(path.join(__dirname, "/views/partials"));

// custom helper to create options with a selected value
// context have the first object sent as an argument
// options is an object with function and a hash object with params
hbs.registerHelper("selectOption", function(context, options) {
  // in options.hash we have the id we want to compare to add a selected atribute
  let { campId } = options.hash;
  let ret = "";
  for (let index = 0; index < context.length; index++) {
    // if id's are a match, we add the selected attribute
    if (context[index].id == campId)
      ret += `<option value=${context[index].id} selected>${
        context[index].name
      }</option>`;
    // otherwise, we create a normal option
    else
      ret += `<option value=${context[index].id}>${
        context[index].name
      }</option>`;
  }
  // we return an instance of a safe string
  return new hbs.SafeString(ret);
});

hbs.registerHelper("ifCond", function(v1, v2, options) {
  if (String(v1) === String(v2)) {
    return options.fn(this);
  }
  return options.inverse(this);
});

// default value for title local
app.locals.title = "TapCarAds";

const index = require("./routes/index");
app.use("/", index);
const auth = require("./routes/auth");
app.use("/auth", auth);
const dashboard = require("./routes/dashboard");
app.use("/dashboard", dashboard);
const campaign = require("./routes/campaign");
app.use("/campaign", campaign);
const zones = require("./routes/zones");
app.use("/zones", zones);
const player = require("./routes/player");
app.use("/player", player);

module.exports = app;
