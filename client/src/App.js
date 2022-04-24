import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageList from "./components/ImageList";

const App = () => {
  return (
    <section style={{ maxWidth: "600px", margin: "0 auto" }}>
      <ToastContainer />
      <h2>Image Uploader</h2>
      <UploadForm />
      <ImageList />
    </section>
  );
};

export default App;
