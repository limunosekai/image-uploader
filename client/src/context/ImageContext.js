import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [me] = useContext(AuthContext);

  useEffect(() => {
    axios
      .get("/images")
      .then((res) => setImages(res.data))
      .catch((err) => console.err(err));
  }, []);

  useEffect(() => {
    if (me?.sessionId) {
      axios
        .get("/users/me/images", {
          headers: {
            sessionid: me.sessionId,
          },
        })
        .then((res) => setMyImages(res.data))
        .catch((err) => console.err(err));
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me?.sessionId]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
