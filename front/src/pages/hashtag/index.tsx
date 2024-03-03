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

  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state: RootState) => state.post
  );

  const lastId = mainPosts.length > 0 ? mainPosts[mainPosts.length - 1]?.id : 0;

  useEffect(() => {
    dispatch(loadMyInfo());

    if (hasMorePosts && !loadPostsLoading && tag !== undefined) {
      //hasMorePosts && !loadPostsLoading일 때 해야 dispatch계속 되는걸 방지할 수 있음.
      console.log("Fetching hashtag posts. LastId:", lastId);
      dispatch(loadHashtagPosts({ lastId: lastId, tag: tag }));
      console.log(tag, `태그`, lastId, `라스트아이디`);
    }
  }, [dispatch, tag, hasMorePosts, loadPostsLoading, lastId]);

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
