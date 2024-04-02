import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { v4 as uuidv4 } from "uuid";
import routes from "../routes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { AppDispatch } from "../store/configureStore";
import { loadMyInfo } from "../reducers/user";
import { loadPosts } from "../reducers/post";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";

const Home: React.FC = () => {
  const location = useLocation(); // 현재 페이지 location
  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀
  const { me } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  // const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading, retweetError } =
    useSelector((state: RootState) => state.post);

  // 경로가 변경될 때마다 타이틀 업데이트
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  const lastId = mainPosts[mainPosts.length - 1]?.id;

  useEffect(() => {
    dispatch(loadMyInfo());
    console.log(lastId, `라스트아이디`);

    //posts 불러오기
    if (lastId && hasMorePosts && !loadPostsLoading) {
      // lastId 값이 존재하는지 확인
      dispatch(loadPosts(lastId));
      console.log(lastId, `라스트아이디`);
    }
  }, [dispatch, lastId, hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={uuidv4()} post={post} images={post.Images} />
      ))}
    </AppLayout>
  );
};

export default Home;
