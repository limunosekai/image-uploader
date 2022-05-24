import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(true);
  const [imageUrl, setImageUrl] = useState("/images");
  const [me] = useContext(AuthContext);
  const loadingRef = useRef(false);
  const lastId = images.length > 0 ? images[images.length - 1]._id : null;

  const getImages = (url) => {
    if (!loadingRef.current) {
      loadingRef.current = true;
      axios
        .get(url)
        .then((res) => setImages((prev) => [...prev, ...res.data]))
        .catch((err) => console.log(err))
        .finally(() => (loadingRef.current = false));
    }
  };

  useEffect(() => {
    getImages(imageUrl);
  }, [imageUrl]);

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

  const loadMoreImages = useCallback(() => {
    if (!lastId || loadingRef.current) return;
    setImageUrl(`/images?lastId=${lastId}`);
  }, [lastId]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
};
