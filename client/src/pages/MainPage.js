import React, { useContext } from "react";
import ImageList from "../components/ImageList";
import UploadForm from "../components/UploadForm";
import { AuthContext } from "../context/AuthContext";

function MainPage() {
  const [me] = useContext(AuthContext);
  return (
    <>
      <h2>Image Uploader</h2>
      {me?.sessionId && <UploadForm />}
      <ImageList />
    </>
  );
}

export default MainPage;
