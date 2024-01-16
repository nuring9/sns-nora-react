import express from "express";
import { Post, Comment, Image, User } from "../models";
import { Op } from "sequelize";

const router = express.Router();

router.get("/", async (req, res, next) => {
  // GET /posts
  try {
    const where: { id?: any } = {};

    const lastId: number | undefined = parseInt(
      req.query.lastId?.toString() || "0",
      10
    );
    // undefined일 경우도 문자열로 변환 후 parsInt하려고, toString() 사용.
    if (!isNaN(lastId)) {
      // 초기 로딩이 아닐 때,
      where.id = { [Op.lt]: lastId };
    }
    // if (lastId) {
    //   // 초기 로딩이 아닐 때,
    //   where.id = { [Op.lt]: lastId };
    // }
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [
        ["createdAt", "DESC"],
        [Comment, "createdAt", "DESC"],
      ],
      include: [
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
    });
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
