import express, { Request, Response } from "express";
import { Post, Comment, Image, User } from "../models";
import { isLoggedIn } from "./middlewares";

const router = express.Router();

router.post("/", isLoggedIn, async (req: Request, res: Response, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      UserId: parseInt(req.body.userId, 10),
    });
    // if (req.body.image) {
    //   if (Array.isArray(req.body.image)) {
    //     // 이미지를 여러 개 올리면 image: [사진.png, 사진2.png]
    //     const images = await Promise.all(
    //       req.body.image.map((image: any) => Image.create({ src: image }))
    //     );
    //     await post.addImages(images);
    //   } else {
    //     // 이미지를 하나만 올리면 image: 사진.png
    //     const image = await Image.create({ src: req.body.image });
    //     await post.addImages(image);
    //   }
    // }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User, // 댓글 작성자
              attributes: ["id", "nick"],
            },
          ],
        },
        {
          model: User, // 게시글 작성자
          attributes: ["id", "nick"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    res.status(201).json(fullPost); // 프론트로 돌려주기. 그럼 reducer에 response에 들어간다.
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
          attributes: ["id", "nick"],
        },
      ],
    });
    res.status(200).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post(
  "/:postId/comment",
  isLoggedIn,
  async (req: Request, res: Response, next) => {
    // POST /post/1/comment
    try {
      const post = await Post.findOne({
        where: { id: req.params.postId },
      });
      if (!post) {
        return res.status(403).send("존재하지 않는 게시글입니다."); // return을 해야 여기서 멈춤. 밑의 res.send까지 되지않음.
      }
      const comment = await Comment.create({
        content: req.body.content,
        PostId: parseInt(req.params.postId, 10),
        UserId: req.user?.id || 0,
        // req.user.id를 사용하려면 req.user에서 undefilnd가 발생.. 프론트에서 userId?: number | undefined; 로하고, req.usr가 없으면 0을 반환하는걸로 대체하였는데 추후 코드 수정하자.
      });
      const fullComment = await Comment.findOne({
        where: { id: comment.id },
        include: [
          {
            model: User,
            attributes: ["id", "nick"],
          },
        ],
      });
      res.status(201).json(fullComment);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
);

export default router;
