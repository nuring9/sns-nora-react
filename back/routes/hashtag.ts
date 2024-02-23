import express from "express";
import { Op } from "sequelize";
import { Post, User, Comment, Hashtag, Image } from "../models";

const router = express.Router();

router.get("/:hashtag", async (req, res, next) => {
  // GET /hashtag/해시태그
  try {
    const where: { id?: any } = {};

    const lastId: number | undefined = parseInt(
      req.query.lastId?.toString() || "0",
      10
    );
    // if (!isNaN(lastId)) {
    //   // 초기 로딩이 아닐 때
    //   where.id = { [Op.lt]: lastId };
    // }  오류 코드 reducers/post의 mainPosts 생성되지 않음.

    if (!isNaN(lastId) && lastId > 0) {
      // 초기 로딩이 아닐 때, && lastId가 0보다 큰 경우에만 where.id 조건이 추가.
      // 이렇게 해야 실행된다.
      where.id = { [Op.lt]: lastId };
      console.log(lastId, "라스트아이디");
    }
    console.log("해시태그:", req.params.hashtag); // 해시태그 파싱 확인

    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Hashtag,
          where: { title: decodeURIComponent(req.params.hashtag) }, //  Hashtag모델에서 title가져옴.
          // URI 디코딩
        },
        {
          model: User,
          attributes: ["id", "nick"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nick"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nick"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
      logging: true, // 쿼리 로깅 활성화
    });
    console.log("게시물 검색 결과:", posts); // 게시물 검색 결과 확인
    res.status(200).json(posts);
  } catch (error) {
    console.log("hashtag오류", error);
    next(error);
  }
});

export default router;
