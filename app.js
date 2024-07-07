const express = require("express");
const bcrypt = require("bcryptjs");
const flash = require("connect-flash");
const session = require("express-session");
const CookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const IsLoggedin = require("./middlewares/IsLoggedin");
const app = express();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(CookieParser());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
     session({
          saveUninitialized: true,
          resave: true,
          secret: "TOPSECRET",
     })
);
app.use(flash());

const UserModel = require("./models/user-model");
const MistriModel = require("./models/mistri-model");

app.get("/", IsLoggedin, async (req, res) => {
     res.render("index", { success: req.flash("success") });
});
app.get("/login", async (req, res) => {
     res.render("login", { error: req.flash("error") });
});
app.post("/login", async (req, res) => {
     const { email, password } = req.body;
     try {
          const user = await UserModel.findOne({ email });
          const mistri = await MistriModel.findOne({ email });
          if (user) {
               bcrypt.compare(password, user.password, async function (error, result) {
                    if (result) {
                         const token = jwt.sign({ email: user.email }, "TOPSECRET");
                         const expires = new Date();
                         expires.setFullYear(expires.getFullYear() + 100);
                         res.cookie("token", token, {
                              httpOnly: true,
                              expires,
                              secure: true,
                              sameSite: "Strict",
                         });
                         res.redirect("/");
                    } else {
                         req.flash("error", "Invalid credentials");
                         res.redirect("/login");
                    }
               });
          } else if (mistri) {
               bcrypt.compare(password, mistri.password, async function (error, result) {
                    if (result) {
                         const token = jwt.sign({ email: mistri.email }, "TOPSECRET");
                         const expires = new Date();
                         expires.setFullYear(expires.getFullYear() + 100);
                         res.cookie("token", token, {
                              httpOnly: true,
                              expires,
                              secure: true,
                              sameSite: "Strict",
                         });
                         res.redirect("/");
                    } else {
                         req.flash("error", "Invalid credentials");
                         res.redirect("/login");
                    }
               });
          }
     } catch (error) {
          req.flash("error", error.message);
          res.redirect("/login");
     }
});
app.get("/register", async (req, res) => {
     res.render("register", { error: req.flash("error") });
});
app.post("/register", async (req, res) => {
     const { email, password } = req.body;
     try {
          const FindUser = await UserModel.findOne({ email });
          if (FindUser) {
               req.flash("error", "Account already exists");
               res.redirect("/register");
          } else {
               const expires = new Date();
               expires.setFullYear(expires.getFullYear() + 100);
               bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(password, salt, async (error, hash) => {
                         const user = await UserModel.create({
                              email,
                              password: hash,
                         });
                         const token = jwt.sign({ email: user.email }, "TOPSECRET");
                         res.cookie("token", token, {
                              httpOnly: true,
                              expires,
                              secure: true,
                              sameSite: "Strict",
                         });
                         req.flash("success", "Account created successfully!");
                         res.redirect("/");
                    });
               });
          }
     } catch (error) {
          req.flash("error", "Something went wrong!");
          res.redirect("/");
     }
});
app.get("/register/mistri", async (req, res) => {
     res.render("register-mistri", { error: req.flash("error") });
});
app.post("/register/mistri", upload.single("ProfilePicture"), async (req, res) => {
     try {
          const { email, password, dob, phone, age } = req.body;
          const ProfilePicture = req.file.buffer;
          const FindMistri = await MistriModel.findOne({ email });
          if (FindMistri) {
               req.flash("error", "Account already exists");
               res.redirect("/register/mistri");
          } else {
               bcrypt.genSalt(10, async (error, salt) => {
                    bcrypt.hash(password, salt, async (error, hash) => {
                         const Mistri = await MistriModel.create({
                              email,
                              password: hash,
                              ProfilePicture,
                              dob,
                              phone,
                         });
                         const token = jwt.sign({ email: Mistri.email }, "TOPSECRET");
                         const expires = new Date();
                         expires.setFullYear(expires.getFullYear() + 100);
                         res.cookie("token", token, {
                              httpOnly: true,
                              expires,
                              secure: true,
                              sameSite: "Strict",
                         });
                         req.flash("success", "Account created successfully");
                         res.redirect("/");
                    });
               });
          }
     } catch (error) {
          req.flash("error", "Something went wrong");
          res.redirect("/register/mistri");
     }
});

app.listen(3000);
