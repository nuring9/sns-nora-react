import React, { useCallback, useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { changeNickname } from "../reducers/user";
import { RootState } from "../store/configureStore";
import { AppDispatch } from "../store/configureStore";

import styled from "styled-components";

const FormWrapper = styled(Form)`
  width: 50%;
  margin: auto;
`;

const NickEditForm: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const [nickname, setNicname] = useState(me?.nickname || "");
  const dispatch = useDispatch<AppDispatch>();

  const onChangeNick = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNicname(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(changeNickname(nickname));
      setNicname("");
    },
    [dispatch, nickname]
  );

  return (
    <div>
      <FormWrapper onSubmit={onSubmit}>
        <InputGroup className="mb-3 mt-3 p-0">
          <Form.Control
            value={nickname}
            onChange={onChangeNick}
            placeholder="닉네임을 입력하세요."
            aria-label="nickEditForm"
            aria-describedby="nickEditForm"
          />
          <Button type="submit" variant="outline-secondary" id="nickEditButton">
            수정
          </Button>
        </InputGroup>
      </FormWrapper>
    </div>
  );
};
export default NickEditForm;
