const mongoose = require("mongoose");

const MistriSchema = mongoose.Schema({
     email: String,
     password: String,
     age: Number,
     phone: Number,
     dob: String,
     ProfilePicture: Buffer,
});
const MistriModel = mongoose.model("Mistri", MistriSchema);
module.exports = MistriModel;
