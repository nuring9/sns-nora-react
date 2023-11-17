import React from "react";
import { Post } from "../types";

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div>
      <h2>{post.id}</h2>
      <p>{post.content}</p>
      {/* 필요한 내용 추가 */}
    </div>
  );
};

export default PostCard;

// import React, { useState, useCallback } from "react";
// import {
//   Card,
//   Button,
//   OverlayTrigger,
//   Tooltip,
//   ListGroup,
// } from "react-bootstrap";
// import { Heart, ChatRight, ThreeDotsVertical } from "react-bootstrap-icons";
// import { useSelector } from "react-redux";
// import { RootState } from "../store/configureStore";
// import { Post } from "../types";

// // import CommentForm from "./CommentForm";
// // import PostCardContent from "./PostCardContent";
// // import PostImages from "./PostImages";
// // import FollowButton from "./FollowButton";
// import Avatar from "react-avatar";

// const PostCard: React.FC<{ post: Post }> = ({ post }) => {
//   const [commentFormOpened, setCommentFormOpened] = useState<boolean>(false);
//   const id = useSelector(
//     (state: RootState) => state.user.me && state.user.me.id
//   );

//   const [liked, setLiked] = useState<boolean>(false);

//   const onToggleLike = useCallback(() => {
//     setLiked((prev) => !prev);
//   }, []);

//   const onToggleComment = useCallback(() => {
//     setCommentFormOpened((prev) => !prev);
//   }, []);

//   return (
//     <div className="mb-4" key={post.id}>
//       <Card>
//         <Card.Header>
//           <div className="d-flex align-items-center justify-content-between">
//             <div>{/* <FollowButton post={post} /> */}</div>
//             <div>
//               <OverlayTrigger
//                 overlay={
//                   <Tooltip id={`tooltip-ellipsis-${post.id}`}>
//                     {id && post.User.id === id ? (
//                       <>
//                         <Button>수정</Button>
//                         <Button variant="danger">삭제</Button>
//                       </>
//                     ) : (
//                       <Button>신고</Button>
//                     )}
//                   </Tooltip>
//                 }
//               >
//                 <Button variant="light">
//                   <ThreeDotsVertical />
//                 </Button>
//               </OverlayTrigger>
//             </div>
//           </div>
//         </Card.Header>
//         <Card.Body>
//           <div className="d-flex align-items-center">
//             <Avatar>{post.User.nickname[0]}</Avatar>
//             <div className="ml-2">
//               <Card.Title>{post.User.nickname}</Card.Title>
//               <Card.Text>
//                 {/* <PostCardContent postData={post.content} /> */}
//               </Card.Text>
//             </div>
//           </div>
//           {/* {post.Images[0] && <PostImages images={post.Images} />} */}
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <Button variant="link" onClick={onToggleLike} aria-label="좋아요">
//                 {liked ? <Heart color="#eb2f96" /> : <Heart />}
//               </Button>
//               <Button
//                 variant="link"
//                 onClick={onToggleComment}
//                 aria-label="댓글 달기"
//               >
//                 <ChatRight />
//               </Button>
//             </div>
//             <div>{`${post.Comments.length} 댓글`}</div>
//           </div>
//           {commentFormOpened && (
//             <>
//               {/* <CommentForm post={post} /> */}
//               <ListGroup>
//                 {post.Comments.map((item) => (
//                   <ListGroup.Item key={item.id}>
//                     <div className="d-flex align-items-center">
//                       <Avatar>{item.User.nickname[0]}</Avatar>
//                       <div className="ml-2">
//                         <ListGroup.Item href={`/user/${item.User.id}`}>
//                           {item.User.nickname}
//                         </ListGroup.Item>
//                         <p>{item.content}</p>
//                       </div>
//                     </div>
//                   </ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </>
//           )}
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default PostCard;
