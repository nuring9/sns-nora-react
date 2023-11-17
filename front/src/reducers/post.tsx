import { createSlice } from "@reduxjs/toolkit";
import { PostsState, Post } from "../types";

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
          src: "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726",
        },
        {
          src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
        },
        {
          src: "https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "눌2",
          },
          content: "우와 개정판이 나왔군요~",
        },
        {
          User: {
            nickname: "hero",
          },
          content: "얼른 사고싶어요~",
        },
      ],
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
          id: 1,
          nickname: "제로초",
        },
        Images: [],
        Comments: [],
      };

      state.mainPosts = [dummyPost, ...state.mainPosts]; //dummyPost가 앞에 있어야 추가글이 가장 위로 올라감.
      state.postAdded = true;
    },

    // 추가적인 액션들을 필요에 따라 작성합니다.
  },
});

export const { addPost } = postSlice.actions;
export default postSlice;
