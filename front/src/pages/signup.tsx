import { useCallback, useEffect, useState, ChangeEvent, useMemo } from "react";
import routes from "../routes";
import { useLocation, useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import styled from "styled-components";
import "../styles/Signup.scss";
import NavbarLayout from "../components/NavbarLayout";
import useInput from "../hooks/useInput";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../store/configureStore";
import { signUp } from "../reducers/user";
import { User } from "../types";

const FormWrapper = styled(Form)`
  margin: auto;
  padding-top: 50px;
  vertical-align: middle;
`;

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const { signUpLoading, signUpDone, signUpError } = useSelector(
    (state: RootState) => state.user
  );
  const navigate = useNavigate();
  const location = useLocation(); // 현재 페이지 location
  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀

  useEffect(() => {
    if (signUpDone) {
      navigate("/");
    }
  }, [signUpDone, navigate]);

  useEffect(() => {
    if (signUpError) {
      alert(JSON.stringify(signUpError));
    }
  }, [signUpError]);

  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const [nickname, onChangeNickname] = useInput("");

  const [passwordCheck, setPasswordCheck] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setPasswordCheck(e.target.value);
      setPasswordError(e.target.value !== password);
    },
    [password]
  );
  // passwordCheck에서는 중복 체크해줘야하기 때문에 useInput 사용못함.

  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);

  const onChangeTerm = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.checked);
    setTermError(!e.target.checked);
  }, []);

  const ErrorText = useMemo(() => ({ color: "red" }), []);

  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  const onSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();

      if (password !== passwordCheck) {
        setPasswordError(true);
        return;
      }
      if (!term) {
        setTermError(true);
        return;
      }

      const userData: User = {
        email,
        password,
        nickname,
      };

      console.log(email, nickname, password);
      return dispatch(signUp(userData));
    },
    [email, nickname, password, passwordCheck, term, dispatch]
  );

  return (
    <div>
      <NavbarLayout />

      <FormWrapper className="Signup" onSubmit={onSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>이메일 주소</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={onChangeEmail}
            placeholder="name@example.com"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>닉네임</Form.Label>
          <Form.Control
            type="text"
            value={nickname}
            onChange={onChangeNickname}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>비밀번호</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={onChangePassword}
            placeholder="비밀번호"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPasswordcheck">
          <Form.Label>비밀번호 확인</Form.Label>
          <Form.Control
            type="password"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
            placeholder="비밀번호 확인"
          />
          {passwordError && (
            <div style={ErrorText}>비밀번호가 일치하지 않습니다.</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check // prettier-ignore
            type="checkbox"
            checked={term}
            onChange={onChangeTerm}
            label="가입을 동의합니다."
          />
          {termError && <div style={ErrorText}>약관에 동의하셔야 합니다.</div>}
        </Form.Group>
        <Button variant="primary" type="submit" disabled={signUpLoading}>
          {signUpLoading ? "가입 중.." : "가입하기"}
        </Button>
      </FormWrapper>
    </div>
  );
}
