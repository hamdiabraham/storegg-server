const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const flash = require("connect-flash");
const session = require("express-session");
const mainRoute = require("./router");
const cors = require("cors");
const compression = require("compression");

app.use(cors());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte/"))
);
app.use(methodOverride("_method"));

app.use(compression());

app.use(mainRoute);

module.exports = app;
