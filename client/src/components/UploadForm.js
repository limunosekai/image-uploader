import React, { useState, useContext, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ImageContext } from "../context/ImageContext";
import ProgressBar from "./ProgressBar";
import "./UploadForm.css";

const UploadForm = () => {
  const { setImages, setMyImages } = useContext(ImageContext);
  const [files, setFiles] = useState(null);
  const [percent, setPercent] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [previews, setPreviews] = useState([]);
  const inputRef = useRef();

  const handleImageSelect = async (e) => {
    const imageFiles = e.target.files;
    setFiles(imageFiles);
    const imagePreviews = await Promise.all(
      [...imageFiles].map(async (imageFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, fileName: imageFile.name });
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const presignedData = await axios.post("/images/presigned", {
        contentTypes: [...files].map((file) => file.type),
      });

      await Promise.all(
        [...files].map((file, idx) => {
          const { presigned } = presignedData.data[idx];
          const formData = new FormData();
          for (let key in presigned.fields) {
            formData.append(key, presigned.fields[key]);
          }
          formData.append("Content-Type", file.type);
          formData.append("file", file);
          return axios.post(presigned.url, formData, {
            onUploadProgress: (e) => {
              setPercent((prev) => {
                const newArr = [...prev];
                newArr[idx] = Math.round((100 * e.loaded) / e.total);
                return newArr;
              });
            },
          });
        })
      );

      const res = await axios.post("/images", {
        images: [...files].map((file, index) => ({
          imageKey: presignedData.data[index].imageKey,
          originalname: file.name,
        })),
        public: isPublic,
      });

      if (isPublic) {
        setImages((prev) => [...res.data, ...prev]);
      }
      setMyImages((prev) => [...res.data, ...prev]);

      toast.success("업로드 성공");
      setTimeout(() => {
        setPercent([]);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);
    } catch (err) {
      console.error(err.response.data.message);
      toast.error("업로드 실패");
      setPercent([]);
      setPreviews([]);
    } finally {
      setIsPublic(true);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   for (let file of files) {
  //     formData.append("image", file);
  //   }
  //   formData.append("public", isPublic);
  //   try {
  //     const res = await axios.post("http://localhost:4005/images", formData, {
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       onUploadProgress: (e) => {
  //         setPercent(Math.round((100 * e.loaded) / e.total));
  //       },
  //     });
  //     if (isPublic) {
  //       setImages((prev) => [...res.data, ...prev]);
  //     }
  //     setMyImages((prev) => [...res.data, ...prev]);
  //     toast.success("업로드 성공");
  //     setTimeout(() => {
  //       setPercent(0);
  //       setPreviews([]);
  //       inputRef.current.value = null;
  //     }, 3000);
  //   } catch (err) {
  //     console.error(err.response.data.message);
  //     toast.error("업로드 실패");
  //     setPercent(0);
  //     setPreviews([]);
  //   } finally {
  //     setIsPublic(true);
  //   }
  // };

  const previewImages = previews.map((preview, idx) => (
    <div key={idx}>
      <img src={preview.imgSrc} alt="" className="image-preview" />
      <ProgressBar percent={percent[idx]} />
    </div>
  ));

  const fileNames =
    previews.length === 0
      ? "이미지를 업로드해주세요"
      : previews.map((preview, idx) => <p key={idx}>{preview.fileName}</p>);

  return (
    <form onSubmit={onSubmit}>
      <div className="image-preview-wrapper">{previewImages}</div>
      <div className="file-drop">
        {fileNames}
        <input
          ref={inputRef}
          id="image"
          type="file"
          accept="image/*"
          multiple
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
