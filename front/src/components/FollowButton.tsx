import { Button } from "react-bootstrap";
import "../styles/Post.scss";

const FollowButton = () => {
  // const onFollw = useCallback(() => {}, []);

  return (
    <Button className="followButton" size="sm" variant="outline-primary">
      팔로우
    </Button>
  );
};

export default FollowButton;
// import React, { useCallback } from "react";
// import { Button } from "react-bootstrap";
// import { useSelector, useDispatch } from "react-redux";
// import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from "../reducers/user";

// interface FollowButtons {
//   post?: string;
//   id?: number;
// }

// const FollowButton = ({ post }): React.ReactElement => {
//   const dispatch = useDispatch();
//   const { me, followLoading, unfollowLoading } = useSelector(
//     (state) => state.user
//   );
//   const isFollowing = me?.Followings.find((v) => v.id === post.User.id);
//   const onClickButton = useCallback(() => {
//     if (isFollowing) {
//       dispatch({
//         type: UNFOLLOW_REQUEST,
//         data: post.User.id,
//       });
//     } else {
//       dispatch({
//         type: FOLLOW_REQUEST,
//         data: post.User.id,
//       });
//     }
//   }, [isFollowing]);

//   if (post.User.id === me.id) {
//     return null;
//   }
//   return (
//     <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
//       {isFollowing ? "언팔로우" : "팔로우"}
//     </Button>
//   );
// };

// export default FollowButton;
