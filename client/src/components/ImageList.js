import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const { images, myImages, isPublic, setIsPublic } = useContext(ImageContext);
  const [me] = useContext(AuthContext);

  const imgList = (isPublic ? images : myImages).map((img) => (
    <img
      style={{ width: "100%" }}
      key={img.key}
      src={`http://localhost:4005/uploads/${img.key}`}
      alt={img.__filename}
    />
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: "10px" }}>
        {isPublic ? "공개" : "내"} 사진 리스트
      </h3>
      {me?.sessionId && (
        <button type="button" onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "공개" : "내"} 사진 보기
        </button>
      )}
      {imgList}
    </div>
  );
};

export default ImageList;
