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

const NickH4 = styled.h4`
  text-align: center;
  margin-bottom: 30px;
`;

const NickEditForm: React.FC = () => {
  const { me } = useSelector((state: RootState) => state.user);
  const [nickname, setNickname] = useState(me?.nickname || "");
  const dispatch = useDispatch<AppDispatch>();

  const onChangeNick = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNickname(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      dispatch(changeNickname({ nickname }));
      setNickname("");
    },
    [dispatch, nickname]
  );

  return (
    <div>
      <FormWrapper onSubmit={onSubmit}>
        <Form.Label className="mb-0 mt-5 p-0">닉네임 수정</Form.Label>

        <InputGroup className="mb-2 p-0">
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
        <NickH4>{me?.nick}</NickH4>
      </FormWrapper>
    </div>
  );
};
export default NickEditForm;
