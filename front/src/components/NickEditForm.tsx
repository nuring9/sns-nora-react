import React from "react";

import { Form, InputGroup, Button } from "react-bootstrap";
import styled from "styled-components";

const FormWrapper = styled(Form)`
  width: 50%;
  margin: auto;
`;

export default function NickEditForm() {
  return (
    <div>
      <FormWrapper>
        <InputGroup className="mb-3 mt-3 p-0">
          <Form.Control
            placeholder="닉네임을 입력하세요."
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <Button variant="outline-secondary" id="button-addon2">
            수정
          </Button>
        </InputGroup>
      </FormWrapper>
    </div>
  );
}
