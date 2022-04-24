import React, { useState } from "react";
import client from "../client";
import { toast } from "react-toastify";

import ProgressBar from "./ProgressBar";
import "./UploadForm.css";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("이미지 파일을 업로드 해주세요.");
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);

  const handleImageSelect = (e) => {
    const imageFile = e.target.files[0];
    setFile(imageFile);
    setFileName(imageFile.name);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(imageFile);
    fileReader.onload = (e) => setImgSrc(e.target.result);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await client.post("http://localhost:4005/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      toast.success("업로드 성공");
      setTimeout(() => {
        setPercent(0);
        setFileName("이미지 파일을 업로드 해주세요.");
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.error(err.message);
      toast.error("업로드 실패");
      setPercent(0);
      setFileName("이미지 파일을 업로드 해주세요.");
      setImgSrc(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {imgSrc && <img className="image-preview" src={imgSrc} alt="uploaded" />}
      <ProgressBar percent={percent} />
      <div className="file-drop">
        {fileName}
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
        />
      </div>
      <button type="submit" className="submit-btn">
        제출
      </button>
    </form>
  );
};

export default UploadForm;
