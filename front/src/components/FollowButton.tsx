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

  const isFollowing = me?.Followings.find((v: any) => v.id === post.User.id);

  const userId = post.User?.id;

  const onClickButton = useCallback(() => {
    if (userId) {
      if (isFollowing) {
        dispatch(unfollow(userId));
      } else {
        dispatch(follow(userId));
      }
    }
  }, [isFollowing, dispatch, post.User.id]);

  if (post.User.id === me.id) {
    return null;
  }
  return (
    <Button
      className="followButton"
      onClick={onClickButton}
      size="sm"
      variant="outline-primary"
    >
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

export default FollowButton;
