import React, { useState, ChangeEvent, useCallback } from "react";
import {
  Container,
  Nav,
  Navbar,
  Form,
  InputGroup,
  Button,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import "../styles/Post.scss";

const StyledNavbar = styled(Navbar)`
  margin-bottom: 10px;
`;

const NavbarLayout: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const onSearch = useCallback(() => {
    navigate(`/hashtag/${encodeURIComponent(searchInput)}`);
  }, [searchInput, navigate]);

  const onChangeSearchInput = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
    },
    []
  );

  return (
    <div>
      <StyledNavbar bg="primary" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="/">Home</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/profile">프로필</Nav.Link>
            <Nav.Link href="/signup">회원가입</Nav.Link>
          </Nav>
          <Form onSubmit={onSearch}>
            <InputGroup className="w-auto">
              <Form.Control
                placeholder="해쉬태그 입력"
                aria-label="해쉬태그 입력"
                aria-describedby="basic-addon2"
                value={searchInput}
                onChange={onChangeSearchInput}
              />
              <Button style={{ border: "1px solid #495057" }}>검색</Button>
            </InputGroup>
          </Form>
        </Container>
      </StyledNavbar>
    </div>
  );
};
export default NavbarLayout;
