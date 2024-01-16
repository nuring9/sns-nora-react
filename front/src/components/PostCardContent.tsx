import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

interface PostCardContentProps {
  postData: string;
}

const LinkedText = styled(Link)`
  text-decoration: none;
  color: black;
`;

const PostCardContent: React.FC<PostCardContentProps> = ({ postData }) => {
  const splittedData = postData.split(/(#[^\s#]+)/g);

  return (
    <React.Fragment>
      {splittedData.map((v) => {
        if (v.match(/(#[^\s#]+)/)) {
          // 만약 해시태그인애들은 링크로 return (즉, map 반복문중에 해시태그 정규식을 match한 결과값만 Link로 감싸줌. )
          return (
            <span key={uuidv4()}>
              <LinkedText to={`/hashtag/${v.slice(1)}`}>{v}</LinkedText>
            </span>
          );
        }
        return v;
        // 일반적인 글은 그대로 return
      })}
    </React.Fragment>
  );
};

export default PostCardContent;
