import { ListGroup, Button, Card, Row, Container } from "react-bootstrap";
import styled from "styled-components";
// import { useDispatch } from "react-redux";
// import { AppDispatch } from "../store/configureStore";
// import { unfollow, removeFollower } from "../reducers/user";
import { FollowersType } from "../types";
import { useEffect } from "react";

// interface FollowItem {
//   nick?: string;
//   id?: number;
// }

interface FollowProps {
  header: string;
  data: FollowersType[] | undefined;
  onClickMore: () => void;
  loading: boolean;
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

export default function FollowList({
  header,
  data,
  onClickMore,
  loading,
}: FollowProps) {
  useEffect(() => {
    console.log("item data:", data);
  });

  if (!data) {
    return <p>데이터를 불러오는 중입니다...</p>;
  }

  return (
    <ContainerWrapper>
      <h4>{header}</h4>
      <Row className="row-cols-3 p-3">
        {Array.isArray(data) ? (
          data.map((item, index) => {
            console.log("Item:", item);

            return (
              <ListGroup.Item className="p-2" key={index}>
                <CardWrapper>
                  <Card.Body>
                    <Card.Title>{item.nick}</Card.Title>
                  </Card.Body>
                  <ButtonWrapper>
                    <Button variant="danger" size="sm">
                      언팔
                    </Button>
                  </ButtonWrapper>
                </CardWrapper>
              </ListGroup.Item>
            );
          })
        ) : (
          <p>데이터 가져오기 실패</p>
        )}
      </Row>

      <Button variant="primary" onClick={onClickMore} disabled={loading}>
        {loading ? "로딩 중..." : "더 보기"}
      </Button>
    </ContainerWrapper>
  );
}
