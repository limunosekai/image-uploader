import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState({});

  useEffect(() => {
    if (me.sessionId) {
      axios.defaults.headers.common.sessionId = me.sessionId;
    } else {
      delete axios.defaults.headers.common.sessionId;
    }
  }, [me.sessionId]);

  return (
    <AuthContext.Provider value={[me, setMe]}>{children}</AuthContext.Provider>
  );
};
