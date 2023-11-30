import React, { useState } from "react";
import { Image } from "../../types";
import Slick from "react-slick";
import {
  Overlay,
  Header,
  CloseBtn,
  SlickWrapper,
  ImgWrapper,
  Indicator,
  Global,
} from "./styles";

interface ImagesZoomProps {
  images: Image[];
  onClose: () => void;
}

const ImagesZoom: React.FC<ImagesZoomProps> = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global />
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose} />
      </Header>
      <SlickWrapper>
        <Slick
          initialSlide={0} // 첫번째 이미지
          afterChange={(slide) => setCurrentSlide(slide)} // 현재슬라이더가 몇인지는 state로저장
          infinite // 무한반복
          arrows={false} // 화살표 제거
          slidesToShow={1} // 한번에 하나씩 보임
          slidesToScroll={1} // 하나씩 스크롤
        >
          {images.map((v) => (
            <ImgWrapper key={v.src}>
              <img src={v.src} alt={v.src} />
            </ImgWrapper>
          ))}
        </Slick>
        <Indicator>
          <div>
            {currentSlide + 1} /{images.length}
          </div>
        </Indicator>
      </SlickWrapper>
    </Overlay>
  );
};

export default ImagesZoom;
