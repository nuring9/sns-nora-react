import React, { useCallback } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch } from "react-redux";
import { logIn } from "../reducers/user";

const LinkStyle = styled(Link)`
  margin-left: 10px;
`;

// type LoginPayload = {
//   email: string;
//   password: string;
// };

// interface LoginFormProps {p
//   setIsLoggedIn: (value: boolean) => void;
// }

export default function LoginForm() {
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");

  const onSubmitForm = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      console.log(email, password);

      dispatch(logIn({ email, password }));
    },
    [email, password, dispatch]
  );

  return (
    <Form onSubmit={onSubmitForm}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>이메일을 입력하세요</Form.Label>
        <Form.Control
          name="user-id"
          value={email}
          type="email"
          onChange={onChangeEmail}
          placeholder="Enter email"
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>비밀번호</Form.Label>
        <Form.Control
          name="user-password"
          value={password}
          onChange={onChangePassword}
          type="password"
          placeholder="Password"
        />
      </Form.Group>

      <Button variant="primary" type="submit">
        로그인
      </Button>

      <LinkStyle to="/signup">
        <Button variant="primary" type="submit">
          회원가입
        </Button>
      </LinkStyle>
    </Form>
  );
}
