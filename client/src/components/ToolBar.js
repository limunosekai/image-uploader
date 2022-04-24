import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

import "./ToolBar.css";

function ToolBar() {
  const navigate = useNavigate();
  const [me, setMe] = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await axios.patch("/users/logout");
      setMe({});
      toast.success("로그아웃 성공!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="tool-bar-wrapper">
      <button
        className="tool-bar-btn"
        type="button"
        onClick={() => navigate("/")}
      >
        홈
      </button>
      <div>
        {!me?.sessionId ? (
          <>
            <button
              className="tool-bar-btn"
              type="button"
              onClick={() => navigate("/auth/register")}
            >
              회원가입
            </button>
            <button
              className="tool-bar-btn"
              type="button"
              onClick={() => navigate("/auth/login")}
            >
              로그인
            </button>
          </>
        ) : (
          <button className="tool-bar-btn" type="button" onClick={handleLogout}>
            {`로그아웃(${me.name})`}
          </button>
        )}
      </div>
    </div>
  );
}

export default ToolBar;
