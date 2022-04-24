const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/image");
const { upload } = require("../middleware/imageUpload");

imageRouter.post("/images", upload.single("image"), async (req, res) => {
  const image = await new Image({
    key: req.file.filename,
    __filename: req.file.originalname,
  }).save();
  res.json(image);
});
imageRouter.get("/images", async (req, res) => {
  const images = await Image.find();
  res.json(images);
});

module.exports = { imageRouter };
