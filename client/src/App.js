import React from "react";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <section style={{ width: "1060px", margin: "0 auto" }}>
      <ToastContainer />
      <h2>Image Uploader</h2>
      <UploadForm />
    </section>
  );
};

export default App;
