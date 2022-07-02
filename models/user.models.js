const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  password: String,
  salt: {
    type: String,
  },
}).pre("save", async function (next) {
  console.log("this", this);
  try {
    const genSalt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(this.password, genSalt);
    console.log("hash", hash, genSalt);
    this.password = hash;
    this.salt = genSalt;
    next();
  } catch (error) {
    next(error);
  }
});

const UserSchema = model("User", userSchema);
module.exports = UserSchema;
