import express, { Request, Response } from "express";
import { Post, Comment, Image, User, Hashtag } from "../models";
import { isLoggedIn } from "./middlewares";
import multer from "multer"; // 추가
import path from "path"; // 추가
import fs from "fs"; // 추가

const router = express.Router();

try {
  fs.readdirSync("uploads"); // uploads라는 폴더가 있는지 확인.  readdirSync: 동기방식으로 파일을 불러옴.
} catch (error) {
  console.error("uploads 폴더가 없어 uploads 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 없으면 폴더 만들기.   mkdirSync: Directory 생성.
}

const upload = multer({
  // nmulter 설정.
  storage: multer.diskStorage({
    // 어디에 저장할 것인가, 우리는 사용자가 업로드한 것을 disk에 저장한다.
    destination(req, file, done) {
      done(null, "uploads"); // 생성한 uploads폴더에 저장.
    },
    filename(req, file, done) {
      // 파일 이름 설정
      const ext = path.extname(file.originalname);
      // 확장자 추출.  이미지.png -> 이미지2023090234.png = 이미지+날짜스트링.png
      done(null, path.basename(file.originalname, ext) + Date.now() + ext);
      // 파일명에 확장자를 분리 시킨뒤 사이에 날짜를 넣고 다시 확장자를 넣어 줌.
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 파일 사이즈 5mg bite가 작을수도 있으니 변경 가능.
});

router.post(
  "/",
  isLoggedIn,
  upload.none(), // onSubmit의 formData
  async (req: Request, res: Response, next) => {
    try {
      const hashtags = req.body.content.match(/#[^\s#]+/g);
      const post = await Post.create({
        content: req.body.content,
        UserId: parseInt(req.body.userId, 10),
      });
      if (hashtags) {
        const result = await Promise.all(
          hashtags.map((tag: any) =>
            Hashtag.findOrCreate({
              where: { title: tag.slice(1).toLowerCase() },
            })
          )
        ); // [[월요일, 화요일], [수요일, 목요일]] 이렇게 배열이므로 map 사용.
        await post.addHashtags(result.map((v) => v[0]));
      }
      if (req.body.image) {
        if (Array.isArray(req.body.image)) {
          // 이미지를 여러 개 올리면 image: [aa.png, bb.png]
          const images = await Promise.all(
            // 파일들이 전부 Promise이므로, Promise.all 을 사용하면 한번에 두개가 저장됨.
            req.body.image.map((image: any) => Image.create({ src: image }))
          );
          await post.addImages(images);
        } else {
          // 이미지를 하나만 올리면 image: aa.png
          const image = await Image.create({ src: req.body.image });
          await post.addImages([image]);
        }
      }
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
      console.log("fullPost확인", fullPost);
      res.status(201).json(fullPost); // 프론트로 돌려주기. 그럼 reducer에 response에 들어간다.
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

router.post("/images", isLoggedIn, upload.array("image"), (req, res, next) => {
  // front의 input name "image"와 array 동일, 한 장만 업로드하면 single
  // POST /post/images
  console.log(req.files);
  if (req.files) {
    res.json((req.files as Express.Multer.File[]).map((v) => v.filename));
  } else {
    res.status(400).json({ error: "No files provided." });
  }
});

router.get("/:postId", async (req, res, next) => {
  // GET /post/1
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
    });
    if (!post) {
      return res.status(404).send("존재하지 않는 게시글입니다.");
    }
    const fullPost = await Post.findOne({
      where: { id: post.id },
      include: [
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
        {
          model: User,
          attributes: ["id", "nick"],
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
          ],
        },
      ],
    });
    res.status(200).json(fullPost);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
  // POST /post/1/retweet
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId },
      include: [
        {
          model: Post,
          as: "Retweet",
        },
      ],
    });
    if (!post) {
      return res.status(403).send("존재하지 않는 게시글입니다.");
    }
    if (
      req.user?.id === post.UserId || // 내 아이디와 게시글의 아이디가 같으면 내 게시글. 즉 내 게시글을 리트윗 하는 경우와
      (post.Retweet && post.Retweet.UserId === req.user?.id) // 내 글을 다른사람이 리트윗하고 또 내가 그글 을 리트윗 하는 경우 막기
    ) {
      return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
    }
    const retweetTargetId = post.RetweetId || post.id; // 리트윗한 게시글을 찾아보고, RetweetId 사용하거나 post.id를 사용.
    const exPost = await Post.findOne({
      where: {
        UserId: req.user?.id,
        RetweetId: retweetTargetId,
      },
    });
    if (exPost) {
      return res.status(403).send("이미 리트윗했습니다.");
    }
    const retweetContent = await User.findOne({ where: { id: post.UserId } })
      .then((user) => `${user?.nick}님의 글을 리트윗 했습니다.`)
      .catch((err) => {
        console.error("Error retweet content:", err);
        return "Retweet";
      });
    const retweet = await Post.create({
      UserId: req.user?.id, // 클라이언트에서 제공하는 userId 대신에 서버에서 가져온 현재 사용자의 ID를 사용.
      RetweetId: retweetTargetId,
      content: retweetContent, //  allowNull: false이므로 무조껀 넣음.
    });
    const retweetWithPrevPost = await Post.findOne({
      where: { id: retweet.id },
      include: [
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
        {
          model: User,
          attributes: ["id", "nick"],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
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
      ],
    });
    return res.status(201).json(retweetWithPrevPost);
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

router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
  // PATCH /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    if (req.user) {
      await post.addLikers([req.user.id]);
      res.json({ PostId: post.id, UserId: req.user.id });
    } else {
      return res.status(403).send("유저 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
  // DELETE /post/1/like
  try {
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (!post) {
      return res.status(403).send("게시글이 존재하지 않습니다.");
    }
    if (req.user) {
      await post.removeLikers([req.user.id]);
      res.json({ PostId: post.id, UserId: req.user.id });
    } else {
      return res.status(403).send("유저 정보를 찾을 수 없습니다.");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch("/:postId", isLoggedIn, async (req, res, next) => {
  // PATCH /post/10
  const hashtags = req.body.content.match(/#[^\s#]+/g);
  try {
    await Post.update(
      {
        content: req.body.content,
      },
      {
        where: {
          id: req.params.postId,
          UserId: req.user?.id, // 내가 내글 삭제
        },
      }
    );
    const post = await Post.findOne({ where: { id: req.params.postId } });
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map((tag: any) =>
          Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        )
      ); // [[노드, true], [리액트, true]]
      await post?.setHashtags(result.map((v) => v[0]));
    }

    res.status(200).json({
      PostId: parseInt(req.params.postId, 10),
      content: req.body.content,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete("/:postId", isLoggedIn, async (req, res, next) => {
  // DELETE /post/10
  try {
    await Post.destroy({
      where: {
        id: req.params.postId,
        UserId: req.user?.id,
      },
    });
    res.status(200).json({ PostId: parseInt(req.params.postId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

export default router;
