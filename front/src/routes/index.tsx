import IndexPage from "../pages/index";
import Signup from "../pages/signup";
import Profile from "../pages/profile";
import PostPage from "../pages/post";
import UserPage from "../pages/user";
import HashtagPage from "../pages/hashtag";

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
    path: "/hashtag/:tag",
    title: "태그",
    element: <HashtagPage />,
  },
  {
    path: "/post/:id",
    title: "게시글",
    element: <PostPage />,
  },
  {
    path: "/user/:id",
    title: "유저 게시글",
    element: <UserPage />,
  },
  {
    path: "/user/:id/posts",
    title: "유저 게시글",
    element: <UserPage />,
  },
];

export default routes;
