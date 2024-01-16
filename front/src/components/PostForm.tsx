import React, { useRef, useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import styled from "styled-components";
import { addPost } from "../reducers/post";
import { PostText } from "../types";
import { AppDispatch } from "../store/configureStore";
import "../styles/Post.scss";

const FormWrapper = styled(Form)`
  margin: 10px 0 20px;
  width: 100%;
`;

const FormTextarea = styled(Form.Control)`
  resize: none;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
`;

const PostForm: React.FC = () => {
  const { imagePaths, addPostDone } = useSelector(
    (state: RootState) => state.post
  );
  const id = useSelector((state: RootState) => state.user.me?.id);
  const [text, setText] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();
  const imageInput = useRef<HTMLInputElement>(null);

  const onClickImageUpload = useCallback(() => {
    if (imageInput.current) {
      imageInput.current.click();
    }
  }, []);

  // useEffect(() => {
  //   if (addPostDone) {
  //     setText("");
  //   }
  // }, [addPostDone]);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      const postData: PostText = {
        content: text,
        userId: id,
      };
      dispatch(addPost(postData));
      setText("");
    },
    [dispatch, text, id]
  );

  return (
    <FormWrapper encType="multipart/form-data" onSubmit={onSubmit}>
      <Form.Group>
        <FormTextarea
          as="textarea"
          value={text}
          className="post-textarea"
          onChange={onChangeText}
          maxLength={140}
          placeholder="게시글을 입력하세요.."
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
          <div key={uuidv4()} style={{ display: "inline-block" }}>
            <img
              src={"http://localhost:8000/" + v}
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
