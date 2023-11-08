import { ListGroup, Button, Card, Row, Container } from "react-bootstrap";
import styled from "styled-components";

interface FollowItem {
  nickname: string;
}

interface FollowProps {
  header: string;
  data: FollowItem[];
}

const ContainerWrapper = styled(Container)`
  background-color: #ffffff;
  border-radius: 15px;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
  width: 90%;
`;

const CardWrapper = styled(Card)`
  height: 100%;
`;

const ButtonWrapper = styled.div`
  margin: 10px;
`;

export default function FollowList({ header, data }: FollowProps) {
  return (
    <ContainerWrapper>
      <h4>{header}</h4>
      <Row className="row-cols-3 p-3">
        {data.map((item, index) => (
          <ListGroup.Item className="p-2" key={index}>
            <CardWrapper>
              <Card.Body>
                <Card.Title>{item.nickname}</Card.Title>
              </Card.Body>
              <ButtonWrapper>
                <Button variant="danger" size="sm">
                  Stop
                </Button>
              </ButtonWrapper>
            </CardWrapper>
          </ListGroup.Item>
        ))}
      </Row>

      <Button variant="primary">더 보기</Button>
    </ContainerWrapper>
  );
}
