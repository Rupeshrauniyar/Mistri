const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Mistri");

const UserSchema = mongoose.Schema({
  email: String,
  password: String,
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
