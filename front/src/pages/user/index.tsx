import { useEffect } from "react";

import AppLayout from "../../components/AppLayout";
import { v4 as uuidv4 } from "uuid";

import { useParams, useNavigate } from "react-router-dom";
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
  width: 100%;
  height: 50px;
  border-radius: 20px;
`;

const LinkStyled = styled.a`
  color: inherit;
  text-decoration: none;
`;

const UserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const { me } = useSelector((state: RootState) => state.user);
  const { mainPosts } = useSelector((state: RootState) => state.post);
  const navigate = useNavigate();

  const imagePath = process.env.PUBLIC_URL + "/images/heart.png";

  // useEffect(() => {
  //   if (userId !== undefined) {
  //     dispatch(loadUser(parseInt(userId))); // 숫자로 변환 리듀서에서 number로 가기 때문.
  //     dispatch(loadMyInfo());
  //   }
  // }, [dispatch, userId]);

  useEffect(() => {
    if (userId !== undefined) {
      dispatch(loadUser(parseInt(userId))); // 숫자로 변환 리듀서에서 number로 가기 때문.
      dispatch(loadMyInfo());
      const lastId = mainPosts[mainPosts.length - 1]?.id;
      if (lastId !== undefined) {
        dispatch(loadUserPosts({ lastId: lastId, id: parseInt(userId) }));
      }
    }
  }, [dispatch, userId, mainPosts]);

  if (!userInfo) {
    // 로그인 페이지로
    navigate("/");
    return <div>로그인을 해주세요.</div>;
  }

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
      {userInfo && userInfo.id !== me?.id ? (
        <ContainerWrapper>
          <Row>
            <Col>
              <div className="p-3">
                <Row>
                  <Col xs={4} md={5} lg={4}>
                    <ImageStyled src={imagePath} alt="profileheart.png" />
                  </Col>
                  <Col xs={8} md={7} lg={8}>
                    <h4>{me?.nick}</h4>
                    {/* <Button
                      onClick={onLogOut}
                      disabled={logOutLoading}
                      variant="primary"
                      size="sm"
                    >
                      {logOutLoading ? "로그아웃중..." : "로그아웃"}
                    </Button> */}
                  </Col>
                </Row>
                <br />

                <ListGroup horizontal className="w-100">
                  <ListGroup.Item className="flex-fill text-center">
                    <LinkStyled href={`/user/${me?.id}`}>게시물</LinkStyled>
                    <br />
                    {me?.Posts?.length}
                  </ListGroup.Item>
                  <ListGroup.Item className="flex-fill text-center">
                    <LinkStyled href="/profile"> 팔로워 </LinkStyled>
                    <br /> {me?.Followers?.length}
                  </ListGroup.Item>
                  <ListGroup.Item className="flex-fill text-center">
                    <LinkStyled href="/profile"> 팔로우 </LinkStyled>
                    <br /> {me?.Followings?.length}
                  </ListGroup.Item>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </ContainerWrapper>
      ) : null}
      {/* {me && <PostForm />} */}
      {mainPosts.map((post) => (
        <PostCard key={uuidv4()} post={post} images={post.Images} />
      ))}
    </AppLayout>
  );
};

export default UserPage;
