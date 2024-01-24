import React, { useCallback } from "react";
import { AppDispatch } from "../store/configureStore";
import { RootState } from "../store/configureStore";
import { useDispatch, useSelector } from "react-redux";
import { follow, unfollow } from "../reducers/user";
import { Post, Image } from "../types";
import { Button } from "react-bootstrap";
import "../styles/Post.scss";

interface FollowButtonProps {
  post: Post;
}

const FollowButton: React.FC<FollowButtonProps> = ({ post }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { me, followLoading, unfollowLoading } = useSelector(
    (state: RootState) => state.user
  );

  const isFollowing = me?.Followings?.find((v: any) => v.id === post.User.id);
  // Followings?.(내가 팔로잉한 목록 중에 게시글 작성자 아이디가 있으면 내가 팔로잉한 사람)
  const userId = post.User?.id;

  const onClickButton = useCallback(() => {
    if (userId && me) {
      if (isFollowing) {
        dispatch(unfollow({ userId }));
      } else {
        dispatch(follow({ userId }));
      }
    }
  }, [isFollowing, dispatch, userId, me]);

  if (me?.id === post.User.id) {
    return null;
  }

  return (
    <Button
      className="followButton"
      disabled={followLoading || unfollowLoading}
      onClick={onClickButton}
      size="sm"
      variant="outline-primary"
    >
      {followLoading && "팔로우 중"}
      {unfollowLoading && "팔로우 취소중"}
      {!followLoading && !unfollowLoading && isFollowing
        ? "언팔로우"
        : "팔로우"}
    </Button>
  );
};

export default FollowButton;
