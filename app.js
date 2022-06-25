const express = require("express");
const mongoose = require("mongoose");

const connectRetry = () => {
  mongoose
    .connect("mongodb://root:root@mongo:27017/?authSource=admin", {
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Successfully connected to MongoDB");
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectRetry, 5000);
    });
};
connectRetry();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const user = new mongoose.Schema({
  name: String,
});
const userModel = mongoose.model("User", user);
app.post("/create", async (req, res) => {
  const userData = await userModel.create({ name: req.body.name });
  res.json({
    data: userData,
  });
});
app.get("/", async (req, res) => {
  const userData = await userModel.find();
  res.json({
    data: userData,
  });
});

const port = process.env.PORT || 6000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
