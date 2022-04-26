import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

function ImagePage() {
  const { imageId } = useParams();
  const { images, myImages, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLike, setHasLike] = useState(false);
  const image =
    images.find((img) => img._id === imageId) ||
    myImages.find((img) => img._id === imageId);

  useEffect(() => {
    if (me?.sessionId && image?.likes.includes(me.username)) {
      setHasLike(true);
    }
  }, [me?.sessionId, image?.likes]);
  if (!image) {
    return <h3>Loading...</h3>;
  }

  const handleLike = async () => {
    const res = await axios.patch(
      `/images/${imageId}/${hasLike ? "unlike" : "like"}`
    );
    if (res?.data?.public) {
      setImages((prev) => {
        const temp = prev;
        const newArr = temp.map((img) => {
          if (img._id === imageId) {
            img.likes = res.data.likes;
          }
          return img;
        });
        return newArr;
      });
    } else {
      setMyImages((prev) => {
        const temp = prev;
        const newArr = temp.map((img) => {
          if (img._id === imageId) {
            img.likes = res.data.likes;
          }
          return img;
        });
        return newArr;
      });
    }
    setHasLike(!hasLike);
  };

  const handleDelete = () => {};

  return (
    <div>
      이미지 페이지 - {imageId}
      <img
        style={{ width: "100%" }}
        src={`http://localhost:4005/uploads/${image.key}`}
        alt={imageId}
      />
      <span>좋아요 {image.likes.length}</span>
      <button style={{ float: "right", marginLeft: 10 }} onClick={handleDelete}>
        삭제
      </button>
      <button style={{ float: "right" }} onClick={handleLike}>
        {hasLike ? "좋아요 취소" : "좋아요"}
      </button>
    </div>
  );
}

export default ImagePage;
