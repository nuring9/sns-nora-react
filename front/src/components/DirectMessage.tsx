import React from "react";
import ListGroup from "react-bootstrap/ListGroup";
import styled from "styled-components";

const ListGroupWrapper = styled(ListGroup)`
  margin: 0;
`;

export default function DirectMessage() {
  const alertClicked = () => {
    alert("You clicked the third ListGroupItem");
  };
  return (
    <ListGroupWrapper defaultActiveKey="#link1">
      <ListGroup.Item action href="#link1">
        Link 1
      </ListGroup.Item>
      <ListGroup.Item action href="#link2">
        Link 2
      </ListGroup.Item>
      <ListGroup.Item action onClick={alertClicked}>
        This one is a button
      </ListGroup.Item>
    </ListGroupWrapper>
  );
}
