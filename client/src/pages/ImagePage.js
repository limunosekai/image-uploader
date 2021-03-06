import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";

function ImagePage() {
  const { imageId } = useParams();
  const navigate = useNavigate();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLike, setHasLike] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = images.find((img) => img._id === imageId);
    if (img) {
      setImage(img);
    }
  }, [images, imageId]);

  useEffect(() => {
    if (image && image?._id === imageId) {
      return;
    }
    axios
      .get(`/images/${imageId}`)
      .then((res) => {
        setImage(res.data);
        setError(false);
      })
      .catch((err) => {
        setError(true);
        toast.error(err.response.data.message);
      });
  }, [imageId, image]);

  useEffect(() => {
    if (me?.sessionId && image?.likes.includes(me.username)) {
      setHasLike(true);
    }
  }, [me?.sessionId, image?.likes]);

  if (error) {
    return <h3>Error...</h3>;
  } else if (!image) {
    return <h3>Loading...</h3>;
  }

  const handleLike = async () => {
    const res = await axios.patch(
      `/images/${imageId}/${hasLike ? "unlike" : "like"}`
    );
    if (res?.data?.public) {
      setImages((prev) => {
        const temp = prev;
        const newArr = temp.map((img) => {
          if (img._id === imageId) {
            img.likes = res.data.likes;
          }
          return img;
        });
        return newArr;
      });
    } else {
      setMyImages((prev) => {
        const temp = prev;
        const newArr = temp.map((img) => {
          if (img._id === imageId) {
            img.likes = res.data.likes;
          }
          return img;
        });
        return newArr;
      });
    }
    setHasLike(!hasLike);
  };

  const deleteImages = (imgs) => imgs.filter((img) => img._id !== imageId);
  const handleDelete = async () => {
    try {
      if (!window.confirm("?????? ?????????????????????????")) {
        return;
      }
      const res = await axios.delete(`/images/${imageId}`);
      toast.success(res.data.message);
      setImages((prev) => deleteImages(prev));
      setMyImages((prev) => deleteImages(prev));
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      ????????? ????????? - {imageId}
      <img
        style={{ width: "100%" }}
        src={`https://d3bpip0r5pyr9z.cloudfront.net/w600/${image.key}`}
        alt={imageId}
      />
      <span>????????? {image.likes.length}</span>
      {image?.user?.username === me?.username && (
        <button
          style={{ float: "right", marginLeft: 10 }}
          onClick={handleDelete}
        >
          ??????
        </button>
      )}
      <button style={{ float: "right" }} onClick={handleLike}>
        {hasLike ? "????????? ??????" : "?????????"}
      </button>
    </div>
  );
}

export default ImagePage;
