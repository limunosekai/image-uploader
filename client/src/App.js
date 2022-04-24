import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import ToolBar from "./components/ToolBar";

const App = () => {
  return (
    <section style={{ maxWidth: "600px", margin: "0 auto" }}>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </section>
  );
};

export default App;
