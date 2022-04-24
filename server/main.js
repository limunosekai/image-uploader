require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { imageRouter } = require("./routes/imageRouter");
const { userRouter } = require("./routes/userRouter");

const app = express();
const PORT = process.env.PORT || 4005;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected...");
    app.use("/uploads", express.static("uploads"));
    app.use(cors());
    app.use(express.json());
    app.use("/images", imageRouter);
    app.use("/users", userRouter);
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.error(err));
