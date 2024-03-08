import React, { useCallback } from "react";
import styled from "styled-components";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../reducers/user";
import { AppDispatch } from "../store/configureStore";
import { RootState } from "../store/configureStore";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";

const ContainerWrapper = styled(Container)`
  background-color: #ffffff;
  border-radius: 15px;
`;

const LinkStyled = styled.a`
  color: inherit;
  text-decoration: none;
`;

const AvatarWrapper = styled(Avatar)`
  margin-right: 10px;
`;

// const ImageStyled = styled(Image)`
//   width: 100%;
//   height: 50px;
//   border-radius: 20px;
// `;

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { me, logOutLoading } = useSelector((state: RootState) => state.user);

  // const imagePath = process.env.PUBLIC_URL + "/images/heart.png";

  const onLogOut = useCallback(() => {
    dispatch(logOut({}));
    // setIsLoggedIn?.(false);
  }, [dispatch]);

  return (
    <ContainerWrapper>
      <Row>
        <Col>
          <div className="p-3">
            <Row>
              <Col xs={4} md={5} lg={4}>
                <Link to={`/user/${me?.id}`}>
                  <AvatarWrapper
                    src="/images/sa.jpeg"
                    size="70"
                    round={true}
                    textSizeRatio={2}
                  />
                  {/* <ImageStyled src={imagePath} alt="profileheart.png" /> */}
                </Link>
              </Col>
              <Col xs={8} md={7} lg={8}>
                <h4>{me?.nick}</h4>
                <Button
                  onClick={onLogOut}
                  disabled={logOutLoading}
                  variant="primary"
                  size="sm"
                >
                  {logOutLoading ? "로그아웃중..." : "로그아웃"}
                </Button>
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
  );
};

export default UserProfile;
