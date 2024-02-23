import Sequelize from "sequelize";
import configObj from "../config/config";
import User from "./user";
import Post from "./post";
import Hashtag from "./hashtag";
import Image from "./image";
import Comment from "./commend";

const env = (process.env.NODE_ENV as "production" | "test") || "development"; // 환경변수 설정. 배포일때는 production, 개발용은 development
const config = configObj[env]; // config.ts를 가져와 env를 적용함.

export const sequelize = new Sequelize.Sequelize(
  config.database,
  config.username,
  config.password,
  {
    ...config,
    logging: true, // 쿼리 로깅 활성화
  }
);
// config에서 가져옴. 즉, 시퀄라이즈가 노드와 mysql을 연결해준다.(시퀄라이즈가 mysql2 드라이버에 설정 정보를 보내줘서 노드와 mysql연결을 도와줌.)

User.initiate(sequelize);
Post.initiate(sequelize);
Hashtag.initiate(sequelize);
Comment.initiate(sequelize);
Image.initiate(sequelize);

User.associate();
Post.associate();
Hashtag.associate();
Comment.associate();
Image.associate();

export { User, Post, Hashtag, Comment, Image };
