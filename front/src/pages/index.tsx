import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";

import routes from "../routes";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/configureStore";
import { AppDispatch } from "../store/configureStore";
import { loadMyInfo } from "../reducers/user";
import { loadPosts } from "../reducers/post";
import PostForm from "../components/PostForm";
import PostCard from "../components/PostCard";
import { PostLastId } from "../types";

const Home: React.FC = () => {
  const location = useLocation(); // 현재 페이지 location
  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀
  const { me } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  // const { isLoggedIn } = useSelector((state: RootState) => state.user);
  const { mainPosts } = useSelector((state: RootState) => state.post);

  // 경로가 변경될 때마다 타이틀 업데이트
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  const lastIdValue = mainPosts[mainPosts.length - 1]?.id;

  useEffect(() => {
    dispatch(loadMyInfo());
    const lastId = {
      lastId: lastIdValue,
    } as PostLastId;
    dispatch(loadPosts(lastId));
  }, [dispatch, lastIdValue]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => (
        <PostCard key={post.id} post={post} images={post.Images} />
      ))}
    </AppLayout>
  );
};

export default Home;
