import React, { useCallback, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { InputGroup, Form, ButtonGroup, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { AppDispatch } from "../store/configureStore";
import { loadHashtagPosts } from "../reducers/post";

interface PostCardContentProps {
  postData?: string;
  editMode: boolean;
  onChangePost: any;
  onCancelUpdate: any;
}

const HashTagLink = styled(Link)`
  text-decoration: none;
  color: black;
  cursor: pointer; /* 커서를 포인터로 변경하여 클릭 가능한 상태로 만듭니다. */
`;

const PostCardContent: React.FC<PostCardContentProps> = ({
  postData,
  editMode,
  onChangePost,
  onCancelUpdate,
}) => {
  const { updatePostLoading, updatePostDone, mainPosts } = useSelector(
    (state: RootState) => state.post
  );
  const dispatch = useDispatch<AppDispatch>();
  const [editText, setEditText] = useState(postData);
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();

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

  const lastId =
    mainPosts[mainPosts.length - 1] && mainPosts[mainPosts.length - 1].id;

  const onHashTagClick = useCallback(() => {
    console.log(tag);
    if (tag !== undefined) {
      dispatch(loadHashtagPosts({ lastId, tag }));
    }
  }, [dispatch, tag, lastId]);

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
        splittedData?.map((v, i) => {
          if (v.match(/(#[^\s#]+)/)) {
            // 만약 해시태그인애들은 링크로 return (즉, map 반복문중에 해시태그 정규식을 match한 결과값만 Link로 감싸줌.
            if (v.startsWith("#")) {
              // 해시태그는 "#"으로 시작하기 때문에, #로 시작하는지 확인하여 결과를 boolean 반환
              const tag = v.slice(1); // 그럼 앞에 #를 slice
              return (
                <HashTagLink
                  key={i}
                  to={`/hashtag/${tag}`}
                  onClick={onHashTagClick}
                >
                  {v}
                </HashTagLink>
              );
            }
          } else {
            return v;
            // 일반적인 글은 그대로 return
          }
        })
      )}
    </>
  );
};

export default PostCardContent;
