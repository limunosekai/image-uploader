const { Router } = require("express");
const imageRouter = Router();
const Image = require("../models/image");
const { upload } = require("../middleware/imageUpload");
const fs = require("fs");
const { promisify } = require("util");
const mongoose = require("mongoose");
const user = require("../models/user");

const fileUnlink = promisify(fs.unlink);

imageRouter.post("/", upload.array("image", 5), async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("권한이 없습니다.");
    }
    const images = await Promise.all(
      req.files.map(async (file) => {
        const image = await new Image({
          user: {
            _id: req.user.id,
            name: req.user.name,
            username: req.user.username,
          },
          public: req.body.public,
          key: file.filename,
          __filename: file.originalname,
        }).save();
        return image;
      })
    );

    res.json(images);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.get("/", async (req, res) => {
  const { lastId } = req.query;
  try {
    if (lastId && !mongoose.isValidObjectId(lastId)) {
      throw new Error("invalid lastId");
    }
    const images = await Image.find(
      lastId ? { public: true, _id: { $lt: lastId } } : { public: true }
    )
      .sort({ _id: -1 })
      .limit(20);
    res.json(images);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.delete("/:imageId", async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("권한이 없습니다.");
    }
    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error("올바르지 않은 이미지 아이디입니다.");
    }
    const image = await Image.findOneAndDelete({ _id: req.params.imageId });
    if (!image) {
      return res.json({ message: "요청하신 이미지는 이미 삭제되었습니다." });
    }
    await fileUnlink(`./uploads/${image.key}`);
    res.json({ message: "이미지 삭제 완료!", image });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/like", async (req, res) => {
  // like 중복 안되도록
  try {
    if (!req.user) {
      throw new Error("권한이 없습니다.");
    }
    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error("올바르지 않은 이미지 아이디입니다.");
    }
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      {
        $addToSet: { likes: req.user.username },
      },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

imageRouter.patch("/:imageId/unlike", async (req, res) => {
  // like 중복취소 안되도록
  try {
    if (!req.user) {
      throw new Error("권한이 없습니다.");
    }
    if (!mongoose.isValidObjectId(req.params.imageId)) {
      throw new Error("올바르지 않은 이미지 아이디입니다.");
    }
    const image = await Image.findOneAndUpdate(
      { _id: req.params.imageId },
      { $pull: { likes: req.user.username } },
      { new: true }
    );
    res.json(image);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: err.message });
  }
});

module.exports = { imageRouter };
