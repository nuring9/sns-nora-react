import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

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
    <div>
      {splittedData.map((v, i) => {
        if (v.match(/(#[^\s#]+)/)) {
          // 만약 해시태그인애들은 링크로 return (즉, map 반복문중에 해시태그 정규식을 match한 결과값만 Link로 감싸줌. )
          return (
            <LinkedText to={`/hashtag/${v.slice(1)}`} key={i}>
              {v}
            </LinkedText>
          );
        }
        return v;
        // 일반적인 글은 그대로 return
      })}
    </div>
  );
};

export default PostCardContent;
