const router = require("express").Router();
const { UserSchema } = require("../models");
const bcrypt = require("bcrypt");
const { NotAcceptable, NotFound } = require("http-errors");

router.post("/create", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await new UserSchema({
      name,
      email,
      password,
    }).save();
    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
router.post("/log-in", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UserSchema.findOne({ email });
    if (!user) throw NotFound("User not found");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw NotAcceptable("Password is incorrect");
    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/delete", async (req, res) => {
  const { email } = req.body;
  const deleteData = await UserSchema.deleteOne({ email });
  res.json({
    data: deleteData,
  });
});
router.get("/", async (req, res, next) => {
  try {
    const user = await UserSchema.find({});
    res.json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
