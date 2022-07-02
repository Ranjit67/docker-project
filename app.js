const express = require("express");
const mongoose = require("mongoose");
const { NotFound } = require("http-errors");
// const session = require("express-session");
// const redis = require("redis");
// let RedisStore = require("connect-redis")(session);
// const config = {
//   host: "172.22.0.3",
//   port: 6379,
//   pass: "",
// };
// let redisClient = redis.createClient(config);
// redisClient.connect();
// redisClient.on("connect", () => {
//   console.log("Redis client connected");
// });
// redisClient.on("error", (err) => {
//   console.log(err);
// });

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
app.enable("trust proxy");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: "hdksjfhdskjhfsncxv",
//     cookie: {
//       maxAge: 1000 * 60 * 60 * 24 * 7,
//       resave: false,
//       saveUninitialized: false,
//       secure: false,
//       httpOnly: true,
//     },
//   })
// );

app.get("/", async (req, res) => {
  console.log("project2_node-cont_1", req.url);
  res.send("<h1>Test route !!</h1>");
});
const { userRouter } = require("./routers");

app.use("/user", userRouter);

app.use((req, res, next) => {
  console.log("project2_node-cont_1", req.url);
  next(new NotFound("Wrong url."));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err?.message,
      status: err?.status || 500,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
