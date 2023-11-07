import { useEffect } from "react";
import routes from "../routes";
import { useLocation } from "react-router-dom";

import AppLayout from "../components/AppLayout";

export default function Profile() {
  const location = useLocation(); // 현재 페이지 location

  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  return (
    <div>
      <AppLayout>
        <div>프로필</div>
      </AppLayout>
    </div>
  );
}
