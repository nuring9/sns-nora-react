import styled, { createGlobalStyle } from "styled-components";
import { XCircle } from "react-bootstrap-icons";

export const Global = createGlobalStyle`
  .slick-slide {
    display: inline-block;
  }
`;

export const Overlay = styled.div`
  position: fixed;
  z-index: 5000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0; // 전부 0으로하면 화면이 꽉 채워짐.(fixed를 채우는방법임)
`;

export const Header = styled.header`
  height: 44px;
  background: #0d6efd;
  position: relative;
  padding: 0;
  text-align: center;

  & h1 {
    margin: 0;
    font-size: 17px;
    color: #ffff;
    line-height: 44px;
  }
`;

export const SlickWrapper = styled.div`
  height: calc(100% - 44px);
  background: #090909;
`;

export const CloseBtn = styled(XCircle)`
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  font-size: 25px;
  margin-right: 10px;
  margin-top: 10px;
  color: #fff;
`;

export const Indicator = styled.div`
  text-align: center;

  & > div {
    width: 75px;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    background: #313131;
    display: inline-block;
    text-align: center;
    color: white;
    font-size: 15px;
  }
`;

export const ImgWrapper = styled.div`
  padding: 32px;
  text-align: center;

  & img {
    margin: 0 auto;
    max-height: 600px;
  }
`;
