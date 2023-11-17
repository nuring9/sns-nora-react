import { createSlice } from "@reduxjs/toolkit";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostsState {
  posts: Post[];
}

const initialState: PostsState = {
  posts: [
    {
      id: 1,
      title: "First Post",
      content: "This is the content of the first post.",
    },
    {
      id: 2,
      title: "Second Post",
      content: "This is the content of the second post.",
    },
    // 여기에 필요한 만큼 더미 데이터 추가 가능
  ],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost(state, action) {
      const newPost = {
        id: state.posts.length + 1,
        title: action.payload.title,
        content: action.payload.content,
      };
      state.posts.push(newPost);
    },
    // 다른 reducer들은 여기에 추가 가능
  },
});

export const { addPost } = postsSlice.actions;
export default postsSlice.reducer;
