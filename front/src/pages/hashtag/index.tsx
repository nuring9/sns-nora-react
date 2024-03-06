import { useEffect } from "react";
import AppLayout from "../../components/AppLayout";

import { useParams, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/configureStore";
import { RootState } from "../../store/configureStore";
import { loadMyInfo } from "../../reducers/user";

import { loadHashtagPosts } from "../../reducers/post";
import PostCard from "../../components/PostCard";

const HashtagPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tag } = useParams<{ tag: string }>();

  // location.search에 "?!"를 포함하는지 확인
  const location = useLocation();
  const isTagWithSpecialCharacter = location.search.includes("?!");

  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state: RootState) => state.post
  );

  useEffect(() => {
    dispatch(loadMyInfo());

    if (hasMorePosts && !loadPostsLoading && tag !== undefined) {
      const finalTag = isTagWithSpecialCharacter
        ? encodeURIComponent(tag || "") + "?!"
        : encodeURIComponent(tag || "");
      dispatch(
        loadHashtagPosts({
          lastId:
            mainPosts[mainPosts.length - 1] &&
            mainPosts[mainPosts.length - 1].id,
          tag: finalTag,
        })
      );
      console.log(tag);
    }
  }, [
    dispatch,
    tag,
    hasMorePosts,
    loadPostsLoading,
    mainPosts,
    isTagWithSpecialCharacter,
  ]);

  if (loadPostsLoading && mainPosts.length === 0) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <AppLayout>
        {mainPosts.length > 0 ? (
          mainPosts.map((post) => (
            <PostCard key={post.id} post={post} images={post.Images} />
          ))
        ) : (
          <div>해당 해시태그에 대한 포스트가 없습니다.</div>
        )}
      </AppLayout>
    </div>
  );
};

export default HashtagPage;
