import React, { useCallback, useState } from "react";
import { Image } from "../types";
import styled from "styled-components";
import { PlusCircle } from "react-bootstrap-icons";
import "../styles/Post.scss";
import ImagesZoom from "./ImagesZoom";

interface PostImagesProps {
  images: Image[];
}

const ImgMore = styled.div`
  display: inline-block;
  width: 50%;
  text-align: center;
  vertical-align: middle;
`;

const PostImages: React.FC<PostImagesProps> = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);

  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation" // 구지 누를 필요가없다라는 시각장애인을 위한 속성 스크린리더가 읽음.
          className="imgViewOne"
          src={`${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }

  if (images.length === 2) {
    return (
      <div className="imgContainer">
        <img
          role="presentation"
          className="imgView"
          src={`${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <img
          role="presentation"
          className="imgView"
          src={`${images[1].src}`}
          alt={images[1].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    );
  }

  return (
    <>
      <div>
        <img
          role="presentation"
          className="imgView"
          src={`${images[0].src}`}
          alt={images[0].src}
          onClick={onZoom}
        />
        <ImgMore role="presentation" onClick={onZoom}>
          <PlusCircle />
          <br />
          {images.length - 1}개의 사진 더 보기
        </ImgMore>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </div>
    </>
  );
};

export default PostImages;
