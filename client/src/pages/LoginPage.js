import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const [, setMe] = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (username.length < 3 || password.length < 6) {
        throw new Error("입력하신 정보가 올바르지 않습니다");
      }
      const res = await axios.patch("/users/login", {
        username,
        password,
      });
      setMe({
        name: res.data.name,
        username: res.data.username,
        sessionId: res.data.sessionId,
      });
      toast.success("로그인 성공!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto 0" }}>
      <h3>로그인</h3>
      <form onSubmit={handleLogin}>
        <CustomInput
          label="아이디 : "
          value={username}
          setValue={setUsername}
          placeholder="아이디 입력"
        />
        <CustomInput
          label="비밀번호 : "
          value={password}
          setValue={setPassword}
          placeholder="비밀번호 입력"
          type="password"
        />
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default LoginPage;
