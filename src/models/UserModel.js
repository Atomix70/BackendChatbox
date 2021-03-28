const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Chatbox");
const Schema = mongoose.Schema;
myipaddress = "http://192.168.18.57:3000";
const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  profilepicURL: { type: String, default: myipaddress + "/images/default.jpg" },
  description: String,
  date: { type: Date, default: Date.now },
  blockedlist: [String],
  mutedlist: [String],
});
UserData = mongoose.model("User", UserSchema);
module.exports = UserData;
