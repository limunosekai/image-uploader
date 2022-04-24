import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);
  const imgList = images.map((img) => (
    <img
      style={{ width: "100%" }}
      key={img.key}
      src={`http://localhost:4005/uploads/${img.key}`}
      alt={img.__filename}
    />
  ));

  return (
    <div>
      <h3>ImageList</h3>
      {imgList}
    </div>
  );
};

export default ImageList;
