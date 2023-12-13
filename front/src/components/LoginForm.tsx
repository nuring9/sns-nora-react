import React, { useCallback, useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../reducers/user";
import { RootState, AppDispatch } from "../store/configureStore";

const LinkStyle = styled(Link)`
  margin-left: 10px;
`;

// type LoginPayload = {
//   email?: string;
//   password?: string;
// };

export default function LoginForm() {
  const dispatch = useDispatch<AppDispatch>();
  const { logInLoading, logInError } = useSelector(
    (state: RootState) => state.user
  );
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
      setIsLoading(false); // 에러 발생 시 로딩 상태 해제
    }
  }, [logInError]);

  const onSubmitForm = useCallback(
    async (e: React.SyntheticEvent) => {
      e.preventDefault();
      console.log(email, password);
      setIsLoading(true);
      dispatch(logIn());
      setIsLoading(false);
    },
    [email, password, dispatch]
  );

  // const onSubmitForm = useCallback(
  //   (e: React.SyntheticEvent) => {
  //     console.log(email, password);
  //     e.preventDefault();
  //     dispatch(logIn({ email, password }));
  //   },
  //   [email, password]
  // );

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
      {/* 
      <Button variant="primary" type="submit">
        로그인
      </Button> */}

      <Button
        variant="primary"
        type="submit"
        disabled={isLoading || logInLoading}
      >
        {isLoading || logInLoading ? "로딩 중..." : "로그인"}
      </Button>

      <LinkStyle to="/signup">
        <Button variant="primary" type="submit">
          회원가입
        </Button>
      </LinkStyle>
    </Form>
  );
}
