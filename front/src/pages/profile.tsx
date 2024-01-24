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
import { Post } from "../types";
import { loadMyInfo, follow, unfollow } from "../reducers/user";

interface ProfileProps {
  post?: Post;
}

const Profile: React.FC<ProfileProps> = ({ post }) => {
  const location = useLocation(); // 현재 페이지 location
  const id = useSelector((state: RootState) => state.user.me?.id);
  const dispatch = useDispatch<AppDispatch>();
  const { me, loadFollowersLoading, loadFollowersError } = useSelector(
    (state: RootState) => {
      console.log(state);
      return state.user;
    }
  );

  useEffect(() => {
    if (post) {
      const followsData = {
        postId: post.id,
        userId: id,
      };
      dispatch(follow(followsData));
      dispatch(unfollow(followsData));
    }
  }, [dispatch, post]);

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
            <FollowList
              header="팔로잉 목록"
              data={me.Followings}
              onClickMore={loadMoreFollowings}
              // loading={!followingsData && !followingError}
            />
            <FollowList
              header="팔로워 목록"
              data={me.Followers}
              onClickMore={loadMoreFollowers}
            />
          </Row>
        </Container>
      </AppLayout>
    </div>
  );
};

export default Profile;
