import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";

function ImagePage() {
  const { imageId } = useParams();
  const { images, myImages } = useContext(ImageContext);
  const image =
    images.find((img) => img._id === imageId) ||
    myImages.find((img) => img._id === imageId);

  if (!image) {
    return <h3>Loading...</h3>;
  }

  return (
    <div>
      이미지 페이지 - {imageId}
      <img
        style={{ width: "100%" }}
        src={`http://localhost:4005/uploads/${image.key}`}
        alt={imageId}
      />
    </div>
  );
}

export default ImagePage;
