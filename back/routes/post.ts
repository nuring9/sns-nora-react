import express, { Request, Response } from "express";
import { Post, Comment, Image, User } from "../models";
// import { isLoggedIn } from "./middlewares";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: parseInt(req.body.userId, 10),
    });
    // if (req.body.image) {
    //   if (Array.isArray(req.body.image)) {
    //     // 이미지를 여러 개 올리면 image: [제로초.png, 부기초.png]
    //     const images = await Promise.all(
    //       req.body.image.map((image: any) => Image.create({ src: image }))
    //     );
    //     await post.addImages(images);
    //   } else {
    //     // 이미지를 하나만 올리면 image: 제로초.png
    //     const image = await Image.create({ src: req.body.image });
    //     await post.addImages(image);
    //   }
    // }
    // const fullPost = await Post.findOne({
    //   where: { id: post.id },
    //   include: [
    //     {
    //       model: Post,
    //       as: "Retweet",
    //       include: [
    //         {
    //           model: User,
    //           attributes: ["id", "nickname"],
    //         },
    //         {
    //           model: Image,
    //         },
    //       ],
    //     },
    //     {
    //       model: User,
    //       attributes: ["id", "nickname"],
    //     },
    //     {
    //       model: User,
    //       as: "Likers",
    //       attributes: ["id", "nickname"],
    //     },
    //     {
    //       model: Image,
    //     },
    //     {
    //       model: Comment,
    //       include: [
    //         {
    //           model: User,
    //           attributes: ["id", "nickname"],
    //         },
    //       ],
    //     },
    //   ],
    // });
    res.status(201).json(post); // 프론트로 돌려주기. 그럼 reducer에 response에 들어간다.
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/", (req, res) => {
  res.json({ id: 1 });
});

router.get("/:postId", async (req: Request, res: Response, next) => {
  // GET /post/1
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }
    const comment = await Comment.create({
      content: req.body.content,
      PostId: parseInt(req.params.postId, 10),
      UserId: req.body.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
      ],
    });
    res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
