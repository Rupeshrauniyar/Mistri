const jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const CookieParser = require("cookie-parser");
const flash = require("connect-flash");
app.use(CookieParser());
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const UserModel = require("../models/user-model");
const MistriModel = require("../models/mistri-model");

const IsLoggedin = async (req, res, next) => {
     if (!req.cookies.token) {
          req.flash("error", "Please login first!");
          res.redirect("/login");
     } else {
          const LoginToken = jwt.verify(req.cookies.token, "TOPSECRET");
          const user = await UserModel.findOne({ email: LoginToken.email });
          const mistri = await MistriModel.findOne({ email: LoginToken.email });
          if (!user && !mistri) {
               return res.redirect("/login");
          }

          req.user = user;

          next();
     }
};

module.exports = IsLoggedin;
