import { Container, Nav, Navbar, Form, InputGroup } from "react-bootstrap";
import styled from "styled-components";

const StyledNavbar = styled(Navbar)`
  margin-bottom: 10px;
`;
export default function NavbarLayout() {
  return (
    <div>
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
    </div>
  );
}
