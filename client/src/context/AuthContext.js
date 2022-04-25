import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState({});
  const sessionId = localStorage.getItem("sessionId");

  useEffect(() => {
    if (me.sessionId) {
      axios.defaults.headers.common.sessionid = me.sessionId;
      localStorage.setItem("sessionId", me.sessionId);
    } else if (sessionId) {
      axios
        .get("/users/me", {
          headers: { sessionid: sessionId },
        })
        .then((res) =>
          setMe({
            name: res.data.name,
            username: res.data.username,
            sessionId: res.data.sessionId,
          })
        )
        .catch((err) => {
          localStorage.removeItem("sessionId");
          delete axios.defaults.headers.common.sessionid;
        });
    } else {
      delete axios.defaults.headers.common.sessionid;
    }
  }, [me.sessionId, sessionId]);

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
