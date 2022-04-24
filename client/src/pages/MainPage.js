import React from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";

function MainPage() {
  return (
    <>
      <h2>Image Uploader</h2>
      <UploadForm />
      <ImageList />
    </>
  );
}

export default MainPage;
