import React, { useRef, useCallback, useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import styled from "styled-components";
import { addPost } from "../reducers/post";
import "../styles/Post.scss";

const FormWrapper = styled(Form)`
  margin: 10px 0 20px;
  width: 100%;
`;

const PostForm: React.FC = () => {
  const { imagePaths, postAdded } = useSelector(
    (state: RootState) => state.post
  );
  const [text, setText] = useState<string>("");
  const dispatch = useDispatch();
  const imageInput = useRef<HTMLInputElement>(null);

  const onClickImageUpload = useCallback(() => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  }, []);

  useEffect(() => {
    if (postAdded) {
      setText("");
    }
  }, [postAdded]);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      dispatch(addPost());
      setText("");
    },
    [dispatch]
  );

  return (
    <FormWrapper encType="multipart/form-data" onSubmit={onSubmit}>
      <Form.Group>
        <Form.Control
          as="textarea"
          value={text}
          className="post-textarea"
          onChange={onChangeText}
          maxLength={140}
          placeholder="게시글을 입력하세요."
        />
      </Form.Group>
      <div>
        <input type="file" multiple hidden ref={imageInput} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="submit" className="post-button">
          게시
        </Button>
      </div>
      <div>
        {imagePaths.map((v) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img
              src={"http://localhost:3065/" + v}
              style={{ width: "200px" }}
              alt={v}
            />
            <div>
              <Button>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};

export default PostForm;
