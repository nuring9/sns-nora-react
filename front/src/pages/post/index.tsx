import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/configureStore";
import { RootState } from "../../store/configureStore";
import { loadMyInfo } from "../../reducers/user";
import { loadPost } from "../../reducers/post";
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { Post } from "../../types";
import { Helmet } from "react-helmet";

const PostPage = () => {
  const { id } = useParams<{ id: string }>();
  const postId = id ? parseInt(id) : undefined;
  const dispatch = useDispatch<AppDispatch>();
  const { singlePost } = useSelector((state: RootState) => state.post);

  useEffect(() => {
    if (postId !== undefined) {
      dispatch(loadPost(postId));
      dispatch(loadMyInfo());
    }
  }, [dispatch, postId]);

  // singlePost가 null인 경우를 처리,
  // null인경우를 처리하지 않으면 오류발생.
  if (!singlePost) {
    return <div>해당 게시글이 없습니다.</div>;
  }

  return (
    <div>
      <AppLayout>
        <Helmet>
          <title>
            {singlePost.User?.nick}
            님의 글
          </title>
          <meta name="description" content={singlePost.content} />
          <meta
            property="og:title"
            content={`${singlePost.User?.nick}님의 게시글`}
          />
          <meta property="og:description" content={singlePost.content} />
          {/* <meta
            property="og:image"
            content={
              singlePost.Images[0]
                ? singlePost.Images[0].src
                : "https://nora.com/favicon.ico"
            }
          />
          <meta property="og:url" content={`https://nora.com/post/${id}`} /> */}
        </Helmet>
        <PostCard post={singlePost as Post} />
      </AppLayout>
    </div>
  );
};

export default PostPage;
