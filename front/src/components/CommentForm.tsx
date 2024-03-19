import React, { useState, useCallback, useEffect } from "react";

import { Form, Button } from "react-bootstrap";
import { Post, Image, CommentDataType } from "../types";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { AppDispatch } from "../store/configureStore";
import { addComment } from "../reducers/post";
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
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: RootState) => state.user.me?.id);
  const { addCommentDone } = useSelector((state: RootState) => state.post);
  const [commentText, setCommentText] = useState<string>("");

  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);

  const onChangeCommentText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCommentText(e.target.value);
    },
    []
  );

  // 여기
  const onSubmitComment = useCallback(
    (e: React.SyntheticEvent) => {
      e.preventDefault();
      const CommentData: CommentDataType = {
        content: commentText,
        postId: post.id,
        userId: id,
      };
      console.log(post.id, commentText);
      dispatch(addComment(CommentData));
    },
    [commentText, post.id, dispatch, id]
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
