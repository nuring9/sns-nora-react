import { useEffect } from "react";
import routes from "../routes";
import { useLocation } from "react-router-dom";
import AppLayout from "../components/AppLayout";

import NickEditForm from "../components/NickEditForm";
import FollowList from "../components/FollowList";
import { Container, Row } from "react-bootstrap";
// import NavbarLayout from "../components/NavbarLayout";
// import DirectMessage from "../components/DirectMessage";
// import UserProfile from "../components/UserProfile";

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
}
