import React, { useCallback, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { InputGroup, Form, ButtonGroup, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";

interface PostCardContentProps {
  postData?: string;
  editMode: boolean;
  onChangePost: any;
  onCancelUpdate: any;
}

const LinkedText = styled(Link)`
  text-decoration: none;
  color: black;
`;

const PostCardContent: React.FC<PostCardContentProps> = ({
  postData,
  editMode,
  onChangePost,
  onCancelUpdate,
}) => {
  const { updatePostLoading, updatePostDone } = useSelector(
    (state: RootState) => state.post
  );
  const [editText, setEditText] = useState(postData);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdate();
    }
  }, [updatePostDone, onCancelUpdate]);

  const onChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setEditText(e.target.value);
    },
    []
  );

  const onClickCancel = useCallback(() => {
    setEditText(postData);
    onCancelUpdate();
  }, [onCancelUpdate, postData]);
  const splittedData = postData?.split(/(#[^\s#]+)/g);

  return (
    <>
      {editMode ? (
        <>
          <InputGroup size="sm" className="mb-3">
            {/* <InputGroup.Text id="inputGroup-sizing-sm">댓글</InputGroup.Text> */}
            <Form.Control
              value={editText}
              onChange={onChangeText}
              aria-label="수정할 텍스트 입력"
              aria-describedby="inputGroup-sizing-sm"
            />
          </InputGroup>
          <ButtonGroup>
            <Button
              disabled={updatePostLoading}
              onClick={onChangePost(editText)}
            >
              {updatePostLoading ? "수정 중..." : "수정"}
            </Button>
            <Button variant="danger" onClick={onClickCancel}>
              취소
            </Button>
          </ButtonGroup>
        </>
      ) : (
        splittedData?.map((v) => {
          if (v.match(/(#[^\s#]+)/)) {
            // 만약 해시태그인애들은 링크로 return (즉, map 반복문중에 해시태그 정규식을 match한 결과값만 Link로 감싸줌. )
            return (
              <span key={uuidv4()}>
                <LinkedText to={`/hashtag/${v.slice(1)}`}>{v}</LinkedText>
              </span>
            );
          }
          return v;
          // 일반적인 글은 그대로 return
        })
      )}
    </>
  );
};

export default PostCardContent;
