import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { RootState } from "../store/configureStore";

const ListGroupWrapper = styled(ListGroup)`
  margin: 0;
`;

export default function DirectMessage() {
  const { me } = useSelector((state: RootState) => state.user);
  // const alertClicked = () => {
  //   alert("You clicked the third ListGroupItem");
  // };
  return (
    <ListGroupWrapper defaultActiveKey={`/user/${me?.id}`}>
      <ListGroup.Item action href={`/user/${me?.id}`}>
        내 게시글
      </ListGroup.Item>
      <ListGroup.Item action href="/follow">
        팔로우 팔로워
      </ListGroup.Item>
      <ListGroup.Item action>continew</ListGroup.Item>
    </ListGroupWrapper>
  );
}
