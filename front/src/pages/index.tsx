import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";

import routes from "../routes";

const Home: React.FC = () => {
  const location = useLocation(); // 현재 페이지 location

  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀

  // 경로가 변경될 때마다 타이틀 업데이트
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  return (
    <AppLayout>
      <div></div>
    </AppLayout>
  );
};

export default Home;
