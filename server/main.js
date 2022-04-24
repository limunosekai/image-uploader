require("dotenv").config();
const express = require("express");
const multer = require("multer");
const { v4: uuid } = require("uuid");
const mime = require("mime-types");
const cors = require("cors");
const mongoose = require("mongoose");
const Image = require("./models/image");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) =>
    cb(null, `${uuid()}.${mime.extension(file.mimetype)}`),
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (["image/jpeg", "image/png", "image/jpg"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type"), false);
    }
  },
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
});

const app = express();
const PORT = 4005;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected...");
    app.use("/uploads", express.static("uploads"));
    app.use(cors());
    app.post("/images", upload.single("image"), async (req, res) => {
      const image = await new Image({
        key: req.file.filename,
        __filename: req.file.originalname,
      }).save();
      res.json(image);
    });
    app.get("/images", async (req, res) => {
      const images = await Image.find();
      res.json(images);
    });
    app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
  })
  .catch((err) => console.error(err));
