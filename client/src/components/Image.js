import React, { useEffect, useState } from "react";

const Image = ({ imageUrl, alt }) => {
  const [isError, setIsError] = useState(false);
  const [hashedUrl, setHashedUrl] = useState(imageUrl);

  useEffect(() => {
    let intervalId;
    if (isError && !intervalId) {
      intervalId = setInterval(() => {
        setHashedUrl(`${imageUrl}#${Date.now()}`);
      }, 1000);
    } else if (!isError && intervalId) {
      clearInterval(intervalId);
    } else {
      setHashedUrl(imageUrl);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [imageUrl, isError]);

  return (
    <img
      alt={alt}
      src={hashedUrl}
      style={{ display: isError ? "none" : "block" }}
      onError={() => setIsError(true)}
      onLoad={() => setIsError(false)}
    />
  );
};

export default Image;
