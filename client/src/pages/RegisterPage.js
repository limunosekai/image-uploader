import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import CustomInput from "../components/CustomInput";
import axios from "axios";
import { toast } from "react-toastify";

function RegisterPage() {
  const [me, setMe] = useContext(AuthContext);
  const [name, setname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (username.length < 3) {
        throw new Error("아이디는 세 글자 이상!");
      }
      if (password.length < 6) {
        throw new Error("비밀번호 6자 이상!");
      }
      if (password !== passwordCheck) {
        throw new Error("비밀번호가 일치하지 않습니다.");
      }
      const res = await axios.post("/users/register", {
        name,
        username,
        password,
      });
      setMe({
        name: res.data.name,
        username: res.data.username,
        sessionId: res.data.sessionId,
      });
      toast.success("회원가입 성공!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto 0" }}>
      <h3>회원가입</h3>
      <form onSubmit={handleSubmit}>
        <CustomInput
          label="이름 : "
          value={name}
          setValue={setname}
          placeholder="이름 입력"
        />
        <CustomInput
          label="아이디 : "
          value={username}
          setValue={setUsername}
          placeholder="아이디 입력"
        />
        <CustomInput
          type="password"
          label="비밀번호 : "
          value={password}
          setValue={setPassword}
          placeholder="비밀번호 입력"
        />
        <CustomInput
          type="password"
          label="비밀번호 확인 : "
          value={passwordCheck}
          setValue={setPasswordCheck}
          placeholder="비밀번호 확인"
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default RegisterPage;
