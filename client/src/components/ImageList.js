import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ImageContext } from "../context/ImageContext";
import Image from "./Image";

import "./ImageList.css";

const ImageList = () => {
  const { images, isPublic, setIsPublic, loadMoreImages } =
    useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMoreImages();
      }
    });
    observer.observe(elementRef.current);

    return () => {
      observer.disconnect();
    };
  }, [loadMoreImages]);

  const imgList = images.map((img, idx) => (
    <Link
      key={img.key}
      to={`/images/${img._id}`}
      ref={idx + 1 === images.length ? elementRef : undefined}
    >
      <Image
        imageUrl={`https://d3bpip0r5pyr9z.cloudfront.net/w140/${img.key}`}
        alt={img.__filename}
      />
    </Link>
  ));

  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: "10px" }}>
        {isPublic ? "공개" : "내"} 사진 리스트
      </h3>
      {me?.sessionId && (
        <button type="button" onClick={() => setIsPublic(!isPublic)}>
          {isPublic ? "내" : "공개"} 사진 보기
        </button>
      )}
      <div className="image-list-container">{imgList}</div>
    </div>
  );
};

export default ImageList;
