import React, { useRef, useCallback, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import styled from "styled-components";
import postSlice, { addPost, uploadImage } from "../reducers/post"; // 액션 가져옴.
import { AppDispatch } from "../store/configureStore";
import "../styles/Post.scss";

import { backUrl } from "../config/config";

const FormWrapper = styled(Form)`
  margin: 10px 0 20px;
  width: 100%;
`;

const FormTextarea = styled(Form.Control)`
  resize: none;
  width: 100%;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  height: 10vh;
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

  useEffect(() => {
    if (addPostDone) {
      setText("");
    }
  }, [addPostDone]);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    []
  );

  // const onSubmit = useCallback(
  //   (e: React.SyntheticEvent) => {
  //     e.preventDefault();
  //     const postData: PostText = {
  //       content: text,
  //       userId: id,
  //     };
  //     dispatch(addPost(postData));
  //     setText("");
  //   },
  //   [dispatch, text, id]
  // );

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("게시글을 작성하세요.");
    }
    const formData = new FormData();
    // multer의 미들웨어 none을 사용하기 위해 formData를 만들어서 작성.
    imagePaths.forEach((p) => {
      formData.append("image", p);
    });
    formData.append("content", text);
    formData.append("userId", (id || 0).toString());
    // formData로 서버로 보낼땐 append로 다 쪼개서 보내야 함!!

    console.log("onsubmitdata", formData);
    return dispatch(addPost(formData));
  }, [dispatch, imagePaths, text, id]);

  const onChangeImages = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      console.log("images", e.target.files);
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, (f) => {
        imageFormData.append("image", f);
      });
      dispatch(uploadImage(imageFormData));
    },
    [dispatch]
  );

  const onRemoveImage = useCallback(
    // 고차 함수
    (index: number) => () => {
      dispatch(postSlice.actions.removeImage(index));
    },
    [dispatch]
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
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="submit" className="post-button">
          게시
        </Button>
      </div>
      <div>
        {imagePaths.map((filename, i) => (
          <div key={uuidv4()} style={{ display: "inline-block" }}>
            <img
              src={`${backUrl}/${filename}`}
              style={{ width: "200px" }}
              alt={filename}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
              {/* map안에 데이터를 넣고 싶으면, 고차 함수 */}
            </div>
          </div>
        ))}
      </div>
    </FormWrapper>
  );
};

export default PostForm;
