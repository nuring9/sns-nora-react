import { useEffect, useState, useCallback } from "react";
import routes from "../routes";
import { useLocation, useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/configureStore";
import NickEditForm from "../components/NickEditForm";
import FollowList from "../components/FollowList";
import { Container, Row } from "react-bootstrap";
import { RootState } from "../store/configureStore";
import { loadMyInfo } from "../reducers/user";

// import NavbarLayout from "../components/NavbarLayout";
// import DirectMessage from "../components/DirectMessage";
// import UserProfile from "../components/UserProfile";

// const fetcher = (url) => axios.get(url).then((result) => result.data);

const Profile: React.FC = () => {
  const location = useLocation(); // 현재 페이지 location
  const dispatch = useDispatch<AppDispatch>();
  const { me } = useSelector((state: RootState) => {
    console.log(state); // Check the structure of your state
    return state.user;
  });

  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);
  const navigate = useNavigate();

  const title = process.env.REACT_APP_APP_TITLE; // 메인 타이틀
  useEffect(() => {
    const route = routes.find((p) => p.path === location.pathname);
    if (route) {
      const { title: subTitle } = route;
      document.title = title + " - " + subTitle;
    }
  }, [location.pathname, title]);

  useEffect(() => {
    dispatch(loadMyInfo());
  }, [dispatch]);

  useEffect(() => {
    if (me && !me.id) {
      navigate("/");
    }
  }, [me, navigate]);

  const followerList = [
    { nickname: "눌1" },
    { nickname: "눌2" },
    { nickname: "눌3" },
  ];
  const followingList = [
    { nickname: "눌4" },
    { nickname: "눌눌눌" },
    { nickname: "눌눌눌눌" },
  ];

  const loadMoreFollowings = useCallback(() => {
    setFollowingsLimit((prev) => prev + 3);
  }, []);

  const loadMoreFollowers = useCallback(() => {
    setFollowersLimit((prev) => prev + 3);
  }, []);

  if (!me) {
    return <div>내 정보 로딩중...</div>;
  }

  return (
    <div>
      <AppLayout>
        <Container>
          <Row>
            <NickEditForm />
            <FollowList header="팔로잉 목록" data={followingList} />
            <FollowList header="팔로워 목록" data={followerList} />
          </Row>
        </Container>
        {/* <NavbarLayout />
      <Container>
        <Row>
          <Col xs={0} md={2} lg={3} className="d-none d-md-block">
            <DirectMessage />
          </Col>

          <Col xs={12} md={6} lg={6} className="d-flex justify-content-center">
            <Row>
              <NickEditForm />

              <FollowList header="팔로잉 목록" data={followingList} />

              <FollowList header="팔로워 목록" data={followerList} />
            </Row>
          </Col>
          <Col xs={0} md={4} lg={3} className="d-none d-md-block">
            <UserProfile />
          </Col>
        </Row>
      </Container> */}
      </AppLayout>
    </div>
  );
};

export default Profile;
