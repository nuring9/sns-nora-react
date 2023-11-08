import React, { ReactNode, useState } from "react";
import styled, { css } from "styled-components";
import { Container, Col, Row } from "react-bootstrap";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import DirectMessage from "./DirectMessage";
import NavbarLayout from "./NavbarLayout";

interface LayoutProps {
  children: ReactNode;
}

const StyledCol = styled(Col)`
  /* 다른 스타일을 적용할 조건 */
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  height: 20%;
`;

const LeftCol = styled(Col)`
  padding: 0;
`;

// const StyledCol = styled(Col)`
//   /* 다른 스타일을 적용할 조건 */

//   ${(props) =>
//     !props.isLoggedIn &&
//     css`
//       width: 40%;
//       padding: 30px;
//       margin: 40px auto; /* 수평 가운데 정렬을 추가 */
//       background-color: #ffffff;
//       border-radius: 15px;
//       /* 추가적인 스타일을 정의할 수 있습니다. */
//     `}
// `;

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return (
    <>
      <NavbarLayout />
      <Container>
        <Row>
          <LeftCol xs={0} md={2} lg={3} className="d-none d-md-block">
            {isLoggedIn ? <DirectMessage /> : null}
          </LeftCol>

          <Col xs={12} md={6} lg={6} className="d-flex justify-content-center">
            {isLoggedIn ? children : null}
          </Col>
          <StyledCol
            xs={0}
            md={4}
            lg={3}
            isLoggedIn={isLoggedIn}
            className="d-none d-md-block"
          >
            {isLoggedIn ? (
              <UserProfile setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <LoginForm setIsLoggedIn={setIsLoggedIn} />
            )}
          </StyledCol>
        </Row>
      </Container>
    </>
  );
};

export default AppLayout;
