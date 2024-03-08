import { useEffect } from "react";

import AppLayout from "../../components/AppLayout";
import { v4 as uuidv4 } from "uuid";

import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch } from "../../store/configureStore";
import { RootState } from "../../store/configureStore";
import { loadMyInfo, loadUser } from "../../reducers/user";
import { loadUserPosts } from "../../reducers/post";
import PostCard from "../../components/PostCard";
import { Container, Row, Col, Image, ListGroup } from "react-bootstrap";
import styled from "styled-components";
import { Helmet } from "react-helmet";

const ContainerWrapper = styled(Container)`
  background-color: #ffffff;
  border-radius: 15px;
`;

const ImageStyled = styled(Image)`
  /* width: 100%; */
  height: 50px;
  border-radius: 20px;
`;

const LinkStyled = styled.a`
  color: inherit;
  text-decoration: none;
`;

const UserPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const userId = id ? parseInt(id) : undefined;
  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { me } = useSelector((state: RootState) => state.user);
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state: RootState) => state.post
  );

  const imagePath = process.env.PUBLIC_URL + "/images/heart.png";

  const lastId = mainPosts[mainPosts.length - 1]?.id;

  useEffect(() => {
    dispatch(loadMyInfo());

    if (hasMorePosts && !loadPostsLoading && userId !== undefined) {
      dispatch(loadUser(userId)); // 숫자로 변환 리듀서에서 number로 가기 때문.
      dispatch(loadUserPosts({ lastId: lastId, id: userId }));
    }
  }, [dispatch, userId, mainPosts, lastId, hasMorePosts, loadPostsLoading]);

  // useEffect(() => {
  //   if (!me) {
  //     // 로그인 페이지로
  //     navigate("/");
  //   }
  // }, [me, navigate]);
  const shouldShowContainerWrapper =
    !loadPostsLoading &&
    (!userId || userInfo) &&
    !window.location.href.includes("/posts");

  return (
    <AppLayout>
      {userInfo && (
        <Helmet>
          <title>
            {userInfo.nick}
            님의 글
          </title>
          <meta name="description" content={`${userInfo.nick}님의 게시글`} />
          <meta property="og:title" content={`${userInfo.nick}님의 게시글`} />
          <meta
            property="og:description"
            content={`${userInfo.nick}님의 게시글`}
          />
        </Helmet>
      )}
      {userInfo && userInfo.id !== me?.id && shouldShowContainerWrapper && (
        <ContainerWrapper>
          <Row>
            <Col>
              <div className="p-3">
                <Row>
                  <Col xs={2} md={2} lg={2}>
                    <ImageStyled src={imagePath} alt="profileheart.png" />
                  </Col>
                  <Col xs={8} md={7} lg={8}>
                    <h4>{userInfo.nick}</h4>
                  </Col>
                </Row>
                <br />

                <ListGroup horizontal className="w-100">
                  <ListGroup.Item className="flex-fill text-center">
                    <LinkStyled href={`/user/${userInfo.id}`}>
                      게시물
                    </LinkStyled>
                    <br />
                    {userInfo.Posts && userInfo.Posts.length > 0
                      ? userInfo.Posts.length
                      : 0}
                  </ListGroup.Item>
                  <ListGroup.Item className="flex-fill text-center">
                    <LinkStyled href="/profile"> 팔로워 </LinkStyled>
                    <br />
                    {userInfo.Followers && userInfo.Followers.length > 0
                      ? userInfo.Followers.length
                      : 0}
                  </ListGroup.Item>
                  <ListGroup.Item className="flex-fill text-center">
                    <LinkStyled href="/profile"> 팔로우 </LinkStyled>
                    <br />
                    {userInfo.Followings ? userInfo.Followings.length : 0}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </ContainerWrapper>
      )}

      {mainPosts.map((post) => (
        <PostCard key={uuidv4()} post={post} images={post.Images} />
      ))}
    </AppLayout>
  );
};

export default UserPage;
