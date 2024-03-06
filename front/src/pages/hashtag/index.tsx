import { useEffect } from "react";
import AppLayout from "../../components/AppLayout";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/configureStore";
import { RootState } from "../../store/configureStore";
import { loadMyInfo } from "../../reducers/user";

import { loadHashtagPosts } from "../../reducers/post";
import PostCard from "../../components/PostCard";

const HashtagPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tag } = useParams<{ tag: string }>();
  const encodedTag = encodeURIComponent(tag || "");

  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    dispatch(loadMyInfo());

    if (hasMorePosts && !loadPostsLoading && tag !== undefined) {
      //hasMorePosts && !loadPostsLoading일 때 해야 dispatch계속 되는걸 방지할 수 있음.
      dispatch(
        loadHashtagPosts({
          lastId:
            mainPosts[mainPosts.length - 1] &&
            mainPosts[mainPosts.length - 1].id,
          tag: encodedTag,
        })
      );
    }
  }, [dispatch, tag, hasMorePosts, loadPostsLoading, mainPosts]);

  if (loadPostsLoading && mainPosts.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <AppLayout>
        {mainPosts.map((post) => (
          <PostCard key={post.id} post={post} images={post.Images} />
        ))}
      </AppLayout>
    </div>
  );
};

export default HashtagPage;
