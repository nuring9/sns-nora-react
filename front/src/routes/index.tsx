import IndexPage from "../pages/index";
import Signup from "../pages/signup";
import Profile from "../pages/profile";

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
];

export default routes;
