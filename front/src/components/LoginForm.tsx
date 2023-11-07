import React, { useCallback, useState, ChangeEvent } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";

const LinkStyle = styled(Link)`
  margin-left: 10px;
`;

interface LoginFormProps {
  setIsLoggedIn: (value: boolean) => void;
}

export default function LoginForm({ setIsLoggedIn }: LoginFormProps) {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const onChangeId = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  }, []);
  const onChangePassword = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      console.log(id, password);
      setIsLoggedIn(true);
    },
    [id, password, setIsLoggedIn]
  );

  return (
    <Form onSubmit={onSubmitForm}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>이메일을 입력하세요</Form.Label>
        <Form.Control
          name="user-id"
          value={id}
          type="email"
          onChange={onChangeId}
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
