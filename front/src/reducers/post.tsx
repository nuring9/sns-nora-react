import { createSlice } from "@reduxjs/toolkit";
import { PostsState, Post } from "../types";

const createdAtTimestamp = new Date().getTime();

const initialState: PostsState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "눌1",
      },
      content: "첫 번째 게시글",
      Images: [
        {
          src: "/images/art-1.jpg",
        },
        {
          src: "/images/art-2.jpg",
        },
        {
          src: "/images/art-3.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "방가",
          },
          content: "첫번째 댓글~",
        },
        {
          User: {
            nickname: "하이",
          },
          content: "두번째 댓글~",
        },
      ],
      createdAt: createdAtTimestamp,
    },
  ],
  imagePaths: [],
  postAdded: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    // 여기에 액션 생성자 및 리듀서를 작성합니다.
    // 예시로 새로운 게시글을 추가하는 액션을 정의합니다.
    addPost: (state) => {
      const dummyPost: Post = {
        id: 2,
        content: "더미데이터입니다.",
        User: {
          id: 2,
          nickname: "눌2",
        },
        Images: [],
        Comments: [],
        createdAt: createdAtTimestamp,
      };

      state.mainPosts = [dummyPost, ...state.mainPosts]; //dummyPost가 앞에 있어야 추가글이 가장 위로 올라감.
      state.postAdded = true;
    },

    // 추가적인 액션들을 필요에 따라 작성합니다.
  },
});

export const { addPost } = postSlice.actions;
export default postSlice;
