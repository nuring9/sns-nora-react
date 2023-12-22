import React, { useCallback } from "react";
import styled from "styled-components";
import { Container, Row, Col, Image, ListGroup, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logOut } from "../reducers/user";
import { AppDispatch } from "../store/configureStore";

const ContainerWrapper = styled(Container)`
  background-color: #ffffff;
  border-radius: 15px;
`;

const ImageStyled = styled(Image)`
  width: 100%;
  height: 50px;
  border-radius: 20px;
`;

// interface LoginFormProps {
//   setIsLoggedIn?: (value: boolean) => void;
// }

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();

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
                <ImageStyled src="data:image/png;base64,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" />
              </Col>
              <Col xs={8} md={7} lg={8}>
                <h4>User Id</h4>
                {/* <p>Content goes here.</p> */}
                <Button onClick={onLogOut} variant="primary" size="sm">
                  로그아웃
                </Button>
              </Col>
            </Row>
            <br />

            <ListGroup horizontal className="w-100">
              <ListGroup.Item className="flex-fill text-center">
                게시물
                <br /> 0
              </ListGroup.Item>
              <ListGroup.Item className="flex-fill text-center">
                팔로워 <br /> 0
              </ListGroup.Item>
              <ListGroup.Item className="flex-fill text-center">
                팔로우 <br /> 0
              </ListGroup.Item>
            </ListGroup>
          </div>
        </Col>
      </Row>
    </ContainerWrapper>
  );
}
