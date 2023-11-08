import { useEffect } from "react";
import routes from "../routes";
import { useLocation } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import "../styles/Signup.scss";
import NavbarLayout from "../components/NavbarLayout";

const FormWrapper = styled(Form)`
  margin: auto;
  padding-top: 50px;
  vertical-align: middle;
`;

export default function Signup() {
  const location = useLocation(); // 현재 페이지 location

  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  return (
    <div>
      <NavbarLayout />

      <FormWrapper className="Signup">
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>이메일 주소</Form.Label>
          <Form.Control type="email" placeholder="name@example.com" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>닉네임</Form.Label>
          <Form.Control type="text" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control type="password" placeholder="비밀번호" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPasswordcheck">
          <Form.Label>비밀번호 체크</Form.Label>
          <Form.Control type="password" placeholder="비밀번호 확인" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check // prettier-ignore
            type="checkbox"
            label="가입을 동의합니다."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          가입하기
        </Button>
      </FormWrapper>
    </div>
  );
}
