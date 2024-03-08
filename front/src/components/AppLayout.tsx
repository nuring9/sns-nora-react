import React, { ReactNode } from "react";
import styled from "styled-components";
import { Container, Col, Row } from "react-bootstrap";
import UserProfile from "./UserProfile";
import LoginForm from "./LoginForm";
import DirectMessage from "./DirectMessage";
import NavbarLayout from "./NavbarLayout";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";

interface LayoutProps {
  children: ReactNode;
}
const LeftCol = styled(Col)`
  margin-top: 10px;
  padding: 0;
`;

const RightCol = styled(Col)`
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 15px;
  padding: 20px;
  height: 20%;
  border: 1px solid #ced4da;
  @media (min-width: 767px) and (max-width: 1023px) {
    padding: 0px;
  }
`;

const CenterCol = styled(Col)`
  padding: 0 7vw;
  @media (min-width: 767px) and (max-width: 1023px) {
    padding: 10px;
  }
`;

const AppLayout: React.FC<LayoutProps> = ({ children }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { me } = useSelector((state: RootState) => state.user);

  return (
    <>
      <NavbarLayout />
      <Container>
        <Row>
          <LeftCol xs={0} md={2} lg={2} className="d-none d-md-block">
            {me ? <DirectMessage /> : null}
          </LeftCol>

          <CenterCol xs={12} md={6} lg={7} className="justify-content-center">
            {me ? children : null}
          </CenterCol>
          <RightCol xs={0} md={4} lg={3} className="d-none d-md-block">
            {me ? <UserProfile /> : <LoginForm />}
          </RightCol>
        </Row>
      </Container>
    </>
  );
};

export default AppLayout;
