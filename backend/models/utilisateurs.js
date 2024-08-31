const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courriel: { type: String, required: true },
  password: { type: String, required: true, minlength: 6 },
  image: { type: String, required: true },
  Admin: { type: Boolean, reqyured: false, default: false },
});
module.exports = mongoose.model("User", userSchema);
