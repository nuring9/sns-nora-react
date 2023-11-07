import React, { ReactNode, useState } from "react";
import styled, { css } from "styled-components";
import {
  Container,
  Nav,
  Navbar,
  Form,
  InputGroup,
  Col,
  Row,
} from "react-bootstrap";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import DirectMessage from "./DirectMessage";

interface LayoutProps {
  children: ReactNode;
}

const StyledNavbar = styled(Navbar)`
  margin-bottom: 10px;
`;

const StyledCol = styled(Col)`
  /* 다른 스타일을 적용할 조건 */
  ${(props) =>
    !props.isLoggedIn &&
    css`
      width: 40%;
      padding: 30px;
      margin: 40px auto; /* 수평 가운데 정렬을 추가 */
      background-color: #ffffff;
      border-radius: 15px;
      /* 추가적인 스타일을 정의할 수 있습니다. */
    `}
`;

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <>
      <StyledNavbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/profile">프로필</Nav.Link>
            <Nav.Link href="/signup">회원가입</Nav.Link>
          </Nav>
          <InputGroup className="w-auto">
            <Form.Control
              placeholder="해쉬태그 입력"
              aria-label="해쉬태그 입력"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Text id="basic-addon2">검색</InputGroup.Text>
          </InputGroup>
        </Container>
      </StyledNavbar>

      <Container>
        <Row>
          <Col md={2}>{isLoggedIn ? <DirectMessage /> : null}</Col>

          <Col md={7} className="d-flex justify-content-center">
            {isLoggedIn ? children : null}
          </Col>
          <StyledCol md={3} isLoggedIn={isLoggedIn}>
            {isLoggedIn ? (
              <UserProfile />
            ) : (
              <div className="d-flex justify-content-center align-items-center">
                <LoginForm setIsLoggedIn={setIsLoggedIn} />
              </div>
            )}
          </StyledCol>
        </Row>
      </Container>
    </>
  );
};

export default AppLayout;
