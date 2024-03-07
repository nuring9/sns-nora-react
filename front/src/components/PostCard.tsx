import React, { useCallback, useState, useMemo } from "react";
import { Post, Image } from "../types";
import { v4 as uuidv4 } from "uuid";
import { Button, Card, Dropdown, ListGroup } from "react-bootstrap";
import {
  ShareFill,
  Heart,
  ChatDots,
  ThreeDots,
  HeartFill,
} from "react-bootstrap-icons";
import "../styles/Post.scss";
import styled from "styled-components";

import PostImages from "./PostImages";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { AppDispatch } from "../store/configureStore";
import {
  likePost,
  unlikePost,
  removePost,
  updatePost,
  retweet,
} from "../reducers/post";

import Avatar from "react-avatar";
import CommentForm from "./CommentForm";
import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";
import { Link } from "react-router-dom";

const CommentWrapper = styled.div`
  padding: 2px 15px;
  margin-bottom: 15px;
`;

const CardWrapper = styled.div`
  margin-top: 10px;
`;

const AvatarWrapper = styled(Avatar)`
  margin-right: 10px;
`;

const FolloWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  background-color: #f0f2f5;
`;

const CommentNick = styled.div`
  font-weight: bold;
  margin-right: 10px;

  & p {
    margin: auto;
    text-align: left;
    padding-left: 10px;
  }
`;

const CommentContent = styled.p`
  margin: auto;
  text-align: left;
`;

const CommentLength = styled.div`
  margin-top: 10px;
  margin-bottom: 10px;
`;

const BottomLine = styled.p`
  border-bottom: 1px solid #e0e0e0;
`;

const ListGroupItem = styled(ListGroup.Item)`
  border: none;
  padding: 2px 0px;
`;

interface PostCardProps {
  post: Post;
  images?: Image[];
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const id = useSelector((state: RootState) => state.user.me?.id);
  const { removePostLoading } = useSelector((state: RootState) => state.post);

  const liked = useMemo(
    () => post.Likers?.find((v) => v.id === id),
    [post.Likers, id]
  ); // 앞의 값이 null, undefined일 경우 [] 임.

  const onClickUpdate = useCallback(() => {
    setEditMode(true);
  }, []);

  const onCancelUpdate = useCallback(() => {
    setEditMode(false);
  }, []);

  const onToggleLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    console.log("Toggle Like", post.id, "User ID", id);
    if (liked) {
      dispatch(unlikePost(post.id));
    } else {
      dispatch(likePost(post.id));
    }
  }, [id, liked, dispatch, post.id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onChangePost = useCallback(
    (editText: string) => () => {
      const updatePostData = {
        postId: post.id,
        content: editText,
        userId: id,
      };
      dispatch(updatePost(updatePostData));
      console.log(post.id, editText);
    },
    [post, dispatch, id]
  );

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    return dispatch(removePost(post.id));
  }, [id, dispatch, post.id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }

    return dispatch(retweet(post.id));
  }, [id, dispatch, post.id]);

  return (
    <CardWrapper>
      <Card>
        <FolloWrapper>{id && <FollowButton post={post} />}</FolloWrapper>
        {post.Images && post.Images[0] && <PostImages images={post.Images} />}
        {/* <Card.Img variant="top" src="/images/art-1.jpg" /> */}
        <Card.Body>
          <Card.Title>
            <Link to={`/user/${post.User?.id}`}>
              <AvatarWrapper
                name={post.User?.nick}
                src="/images/sa.jpeg"
                size="40"
                round={true}
                textSizeRatio={2}
              />
            </Link>
            {post.User?.nick}
          </Card.Title>
          <Card.Text>
            <PostCardContent
              postData={post.content}
              editMode={editMode}
              onChangePost={onChangePost}
              onCancelUpdate={onCancelUpdate}
            />
          </Card.Text>

          {/* 리트윗 */}
          {post.RetweetId && !Number.isNaN(post.RetweetId) && post.Retweet ? (
            <Card>
              {/* <Card.Header>
                <small>{post.User.nick}님이 리트윗 했습니다.</small>
              </Card.Header> */}
              <Card.Body>
                <div className="d-flex align-items-center">
                  <Link to={`/user/${post.Retweet.User.id}`}>
                    <AvatarWrapper
                      name={post.Retweet.User.nick}
                      src="/images/sa.jpeg"
                      size="40"
                      round={true}
                      textSizeRatio={2}
                    />
                  </Link>
                  <div>
                    <Card.Title>{post.Retweet.User?.nick}</Card.Title>
                    <Card.Text>
                      <PostCardContent
                        postData={post.Retweet.content}
                        editMode={editMode}
                        onChangePost={onChangePost}
                        onCancelUpdate={onCancelUpdate}
                      />
                    </Card.Text>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ) : null}

          <div className="card-button">
            <Button variant="white" onClick={onRetweet}>
              <ShareFill />
            </Button>
            <Button variant="white">
              {liked ? (
                <HeartFill style={{ color: "red" }} onClick={onToggleLike} />
              ) : (
                <Heart onClick={onToggleLike} />
              )}
            </Button>
            <Button variant="white" onClick={onToggleComment}>
              <ChatDots />
            </Button>
            <Dropdown>
              <span className="centered">
                <Dropdown.Toggle variant="white" id="dropdown-basic">
                  <ThreeDots />
                </Dropdown.Toggle>
              </span>
              <Dropdown.Menu>
                {/* {post.User && id && post.User.id === id && (
                  <>
                    <Dropdown.Item href="#action1">수정</Dropdown.Item>
                    <Dropdown.Item href="#action2">삭제</Dropdown.Item>
                  </>
                )}

                {post.User && !id && (
                  <Dropdown.Item href="#action3">신고</Dropdown.Item>
                )} */}
                {id && post.User?.id === id ? (
                  <>
                    <Dropdown.Item onClick={onClickUpdate}>수정</Dropdown.Item>
                    <Dropdown.Item
                      disabled={removePostLoading}
                      onClick={onRemovePost}
                    >
                      {removePostLoading ? "삭제 중..." : "삭제"}
                    </Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item href="#action3">신고</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>

        {/* {commentFormOpened && post.Comments.length > 0 && ( */}
        {commentFormOpened && post.Comments && post.Comments.length >= 0 && (
          <CommentWrapper>
            <ListGroup>
              <CommentLength>
                {`${post.Comments.length}개의 댓글`}
              </CommentLength>
              <BottomLine />
              {post.Comments.map((item) => (
                <ListGroupItem key={uuidv4()}>
                  <div className="d-flex align-items-center">
                    <Link to={`/user/${item.User?.id}`}>
                      <AvatarWrapper
                        name={item.User?.nick}
                        size="30"
                        round={true}
                      />
                    </Link>
                    <CommentNick>{item.User?.nick}</CommentNick>
                    <span>
                      <CommentContent>{item.content}</CommentContent>
                    </span>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
            <CommentForm post={post} />
          </CommentWrapper>
        )}
      </Card>
    </CardWrapper>
  );
};

export default PostCard;
