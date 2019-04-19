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

app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  // duracion de la sesion - 1 hora
  cookie: { maxAge: 3600000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}))

// siempre debajo de la configuracion de la sesion
app.use(passport.initialize());
app.use(passport.session())

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

// default value for title local
app.locals.title = "TapCarAds";

const index = require("./routes/index");
app.use("/", index);
const admin = require("./routes/admin");
app.use("/admin", admin);
const admprivate = require("./routes/admprivate");
app.use("/admprivate", admprivate);
const auth = require("./routes/auth");
app.use("/auth", auth);
const dashboard = require("./routes/dashboard");
app.use("/dashboard", dashboard);
const campaign = require("./routes/campaign");
app.use("/campaign", campaign)
const zones = require("./routes/zones");
app.use("/zones", zones)

module.exports = app;
