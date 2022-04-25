import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ImageContext } from "../context/ImageContext";
import ProgressBar from "./ProgressBar";
import "./UploadForm.css";

const UploadForm = () => {
  const { setImages, setMyImages } = useContext(ImageContext);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("이미지 파일을 업로드 해주세요.");
  const [percent, setPercent] = useState(0);
  const [imgSrc, setImgSrc] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  console.log(isPublic);
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
    formData.append("public", isPublic);
    try {
      const res = await axios.post("http://localhost:4005/images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });
      if (isPublic) {
        setImages((prev) => {
          return [...prev, res.data];
        });
      } else {
        setMyImages((prev) => {
          return [...prev, res.data];
        });
      }
      toast.success("업로드 성공");
      setTimeout(() => {
        setPercent(0);
        setFileName("이미지 파일을 업로드 해주세요.");
        setImgSrc(null);
      }, 3000);
    } catch (err) {
      console.error(err.response.data.message);
      toast.error("업로드 실패");
      setPercent(0);
      setFileName("이미지 파일을 업로드 해주세요.");
      setImgSrc(null);
    } finally {
      setIsPublic(true);
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
      <input
        className="public-check"
        type="checkbox"
        id="public-check"
        checked={!isPublic}
        value={isPublic}
        onChange={() => setIsPublic(!isPublic)}
      />
      <label htmlFor="public-check">비공개</label>
      <button type="submit" className="submit-btn">
        제출
      </button>
    </form>
  );
};

export default UploadForm;
