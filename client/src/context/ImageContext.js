import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    axios
      .get("/images")
      .then((res) => setImages(res.data))
      .catch((err) => console.err(err));
  }, []);

  return (
    <ImageContext.Provider value={[images, setImages]}>
      {children}
    </ImageContext.Provider>
  );
};
