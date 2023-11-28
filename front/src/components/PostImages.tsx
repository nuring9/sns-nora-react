import React from "react";
import { Image } from "../types";

interface PostImagesProps {
  images: Image[] | undefined;
}

const PostImages: React.FC<PostImagesProps> = ({ images }) => {
  return (
    <div>
      <div>폼 준비중입니다..</div>
    </div>
  );
};

export default PostImages;
