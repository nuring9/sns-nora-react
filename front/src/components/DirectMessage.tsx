import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

export default function DirectMessage() {
  const alertClicked = () => {
    alert("You clicked the third ListGroupItem");
  };
  return (
    <ListGroup defaultActiveKey="#link1">
      <ListGroup.Item action href="#link1">
        Link 1
      </ListGroup.Item>
      <ListGroup.Item action href="#link2">
        Link 2
      </ListGroup.Item>
      <ListGroup.Item action onClick={alertClicked}>
        This one is a button
      </ListGroup.Item>
    </ListGroup>
  );
}
