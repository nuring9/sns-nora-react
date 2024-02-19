import IndexPage from "../pages/index";
import Signup from "../pages/signup";
import Profile from "../pages/profile";
import PostComponent from "../pages/post";

// import { Post } from "../types";

type MyType = {
  path: string;
  title?: string;
  element: React.ReactElement;
  auth?: boolean;
};

const routes: MyType[] = [
  {
    path: "/",
    title: "Home",
    element: <IndexPage />,
  },
  {
    path: "/signup",
    title: "회원가입 페이지",
    element: <Signup />,
  },
  {
    path: "/profile",
    title: "프로필",
    element: <Profile />,
    auth: true,
  },
  {
    path: "/post/:id",
    title: "포스트",
    element: <PostComponent />,
  },
];

export default routes;
