import React, { useState, useCallback } from "react";

import { Form, Button } from "react-bootstrap";
import { Post, Image } from "../types";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";
import "../styles/Post.scss";

interface PostCardProps {
  post: Post;
  images?: Image[];
}

const FormWrapper = styled(Form)`
  margin-top: 10px;
  width: 100%;
`;

const StyledTextarea = styled(Form.Control)`
  resize: none;
  border: 1px solid #ced4da;
  border-radius: 0.25rem;
  width: calc(100% - 53.69px);
  height: 38px;
  margin-bottom: 0;
`;

const StyledFormGroup = styled(Form.Group)`
  width: 100%;
  display: flex;
  align-items: center;
`;

const CommentForm: React.FC<PostCardProps> = ({ post }) => {
  const id = useSelector((state: RootState) => state.user.me?.id);
  const [commentText, commentSetText] = useState<string>("");

  const onChangeCommentText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      commentSetText(e.target.value);
    },
    []
  );

  const onSubmitComment = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      console.log(post.id, commentText);
      commentSetText("");
    },
    [commentText, post.id]
  );

  return (
    <FormWrapper encType="multipart/form-data" onSubmit={onSubmitComment}>
      <StyledFormGroup>
        <StyledTextarea
          as="textarea"
          value={commentText}
          className="post-textarea"
          onChange={onChangeCommentText}
          maxLength={140}
          placeholder="댓글 달기.."
        />
        <Button type="submit" className="commentButton">
          게시
        </Button>
      </StyledFormGroup>
    </FormWrapper>
  );
};

export default CommentForm;
