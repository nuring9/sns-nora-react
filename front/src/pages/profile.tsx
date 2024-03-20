import { useEffect, useState, useCallback } from "react";
import routes from "../routes";
import useSWR from "swr";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../store/configureStore";
import { Container, Row } from "react-bootstrap";
import { RootState } from "../store/configureStore";
import { Post } from "../types";
import { loadMyInfo, follow, unfollow } from "../reducers/user";

import AppLayout from "../components/AppLayout";
import NickEditForm from "../components/NickEditForm";
import FollowList from "../components/FollowList";

import { backUrl } from "@src/config/config";

interface ProfileProps {
  post?: Post;
}

const fetcher = (url: string) => axios.get(url).then((result) => result.data);

const Profile: React.FC<ProfileProps> = ({ post }) => {
  const location = useLocation(); // 현재 페이지 location
  const id = useSelector((state: RootState) => state.user.me?.id);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { me } = useSelector((state: RootState) => state.user);

  const [followersLimit, setFollowersLimit] = useState(3);
  const [followingsLimit, setFollowingsLimit] = useState(3);

  const { data: followersData, error: followerError } = useSWR(
    `${backUrl}/user/followers?limit=${followersLimit}`,
    fetcher
  );
  const { data: followingsData, error: followingError } = useSWR(
    `${backUrl}/user/followings?limit=${followingsLimit}`,
    fetcher
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
  }, [dispatch, post, id]);

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

  if (followerError || followingError) {
    console.error(followerError || followingError);
    return <div>로딩 중 에러가 발생했습니다. 로그인을 확인해주세요.</div>;
  }

  return (
    <div>
      <AppLayout>
        <Container>
          <Row>
            <NickEditForm />
            <FollowList
              header="팔로우 목록"
              data={followingsData}
              onClickMore={loadMoreFollowings}
              loading={!followingsData && !followingError}
            />
            <FollowList
              header="팔로워 목록"
              data={followersData}
              onClickMore={loadMoreFollowers}
              loading={!followersData && !followerError}
            />
          </Row>
        </Container>
      </AppLayout>
    </div>
  );
};

export default Profile;
