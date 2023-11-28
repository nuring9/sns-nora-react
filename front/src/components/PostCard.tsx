import React, { useCallback, useState } from "react";
import { Post, Image } from "../types";
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
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";

import Avatar from "react-avatar";
import CommentForm from "./CommentForm";

const CommentWrapper = styled.div`
  padding: 2px 15px;
  margin-bottom: 15px;
`;

const AvatarWrapper = styled(Avatar)`
  margin-right: 10px;
`;

const CommentNick = styled.div`
  font-weight: bold;
`;

const CommentContent = styled.p`
  margin: auto;
  text-align: left;
  padding-left: 10px;
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
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [liked, setLiked] = useState(false);

  const onToggleLike = useCallback(() => {
    setLiked((prev) => !prev);
  }, []);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const id = useSelector((state: RootState) => state.user.me?.id);

  return (
    <div>
      <Card>
        {post.Images[0] && <PostImages images={post.Images} />}
        {/* <Card.Img variant="top" src="/images/art-1.jpg" /> */}
        <Card.Body>
          <Card.Title>
            <AvatarWrapper
              // name={post.User.nickname[0]}
              src="/images/sa.jpeg"
              size="40"
              round={true}
              textSizeRatio={2}
            />
            {post.User.nickname}
          </Card.Title>
          <Card.Text>{post.content}</Card.Text>
          <div className="card-button">
            <Button variant="white">
              <ShareFill />
            </Button>
            <Button variant="white" onClick={onToggleLike}>
              {liked ? <HeartFill style={{ color: "red" }} /> : <Heart />}
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
                {id && post.User.id === id ? (
                  <>
                    <Dropdown.Item href="#action1">수정</Dropdown.Item>
                    <Dropdown.Item href="#action2">삭제</Dropdown.Item>
                  </>
                ) : (
                  <Dropdown.Item href="#action3">신고</Dropdown.Item>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Card.Body>
        {commentFormOpened && (
          <CommentWrapper>
            <ListGroup>
              <CommentLength>
                {`${post.Comments.length}개의 댓글`}
              </CommentLength>
              <BottomLine />
              {post.Comments.map((item) => (
                <ListGroupItem key={post.id}>
                  <div className="d-flex align-items-center">
                    <AvatarWrapper
                      name={item.User.nickname}
                      size="30"
                      round={true}
                    />
                    <CommentNick>{item.User.nickname}</CommentNick>
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
    </div>
  );
};

export default PostCard;
