import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Post, CommentDataType, PostText, UpdatePostDataType } from "../types";
import axios from "axios";
import _ from "lodash";

interface PostsState {
  mainPosts: Post[];
  imagePaths: string[];
  hasMorePosts: boolean;
  // postAdded: boolean;
  loadPostLoading: boolean;
  loadPostDone: boolean;
  loadPostError: unknown;
  loadPostsLoading: boolean;
  loadPostsDone: boolean;
  loadPostsError: unknown;
  addPostLoading: boolean;
  addPostDone: boolean;
  addPostError: unknown;
  updatePostLoading: boolean;
  updatePostDone: boolean;
  updatePostError: unknown;
  removePostLoading: boolean;
  removePostDone: boolean;
  removePostError: unknown;
  addCommentLoading: boolean;
  addCommentDone: boolean;
  addCommentError: unknown;
  likePostLoading: boolean;
  likePostDone: boolean;
  likePostError: unknown;
  unlikePostLoading: boolean;
  unlikePostDone: boolean;
  unlikePostError: unknown;
}

const initialState: PostsState = {
  mainPosts: [],
  // singlePost: null,
  imagePaths: [],
  hasMorePosts: true,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
};

const loadPostsThrottle = async (lastId: number) => {
  const response = await axios.get(`/posts?lastId=${lastId}`);
  return response.data;
};

// export const loadPosts = createAsyncThunk(
//   "post/loadPosts",
//   _.throttle(loadPostsThrottle, 5000)
// );  // 원래 코드, 아래 코드 문제가 생기면 이 코드를 활성 화.

export const loadPosts = createAsyncThunk(
  "post/loadPosts",
  async (lastId: number) => {
    const loadPostsThrottled = _.throttle(loadPostsThrottle, 5000);
    return loadPostsThrottled(lastId);
  }
);

export const loadPost = createAsyncThunk("post/loadPost", async (data) => {
  const response = await axios.get(`/post/${data}`);
  return response.data;
});

export const addPost = createAsyncThunk(
  "post/addPost",
  async (data: PostText) => {
    const response = await axios.post("/post", data);
    return response.data;
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async (data: UpdatePostDataType) => {
    const response = await axios.patch(`/post/${data.postId}`, data);
    return response.data;
  }
);

export const removePost = createAsyncThunk(
  "post/removePost",
  async (data: number) => {
    const response = await axios.delete(`/post/${data}`);
    return response.data;
  }
);

export const addComment = createAsyncThunk(
  "post/addComment",
  async (data: CommentDataType) => {
    const response = await axios.post(`/post/${data.postId}/comment`, data); // CommentForm에서 보내준 데이터 postId
    return response.data;
  }
);

export const likePost = createAsyncThunk(
  "post/likePost",
  async (data: number) => {
    const response = await axios.patch(`/post/${data}/like`);
    return response.data;
  }
);

export const unlikePost = createAsyncThunk(
  "post/unlikePost",
  async (data: number) => {
    const response = await axios.delete(`/post/${data}/like`);
    return response.data;
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPost.pending, (draft, action) => {
        draft.loadPostLoading = true;
        draft.loadPostDone = false;
        draft.loadPostError = null;
      })
      .addCase(loadPost.fulfilled, (draft, action) => {
        draft.loadPostLoading = false;
        draft.loadPostDone = true;
        // draft.singlePost = action.payload;
      })
      .addCase(loadPost.rejected, (draft, action) => {
        draft.loadPostLoading = false;
        draft.loadPostError = action.error;
      })
      .addCase(loadPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addCase(addPost.pending, (draft, action) => {
        draft.addPostLoading = true;
        draft.addPostDone = false;
        draft.addPostError = null;
      })
      .addCase(addPost.fulfilled, (draft, action) => {
        draft.addPostLoading = false;
        draft.addPostDone = true;
        draft.mainPosts.unshift(action.payload); // Post.create의 데이터가 여기로 들어옴.
        draft.imagePaths = [];
      })
      .addCase(addPost.rejected, (draft, action) => {
        draft.addPostLoading = false;
        draft.addPostError = action.error;
      })
      .addCase(updatePost.pending, (draft, action) => {
        draft.updatePostLoading = true;
        draft.updatePostDone = false;
        draft.updatePostError = null;
      })
      .addCase(updatePost.fulfilled, (draft, action) => {
        draft.updatePostLoading = false;
        draft.updatePostDone = true;
        // draft.mainPosts.find((v) => v.id === action.payload.PostId).content =
        //   action.payload.content;  오류
        const postToUpdate = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        if (postToUpdate) {
          postToUpdate.content = action.payload.content;
        }
      })
      .addCase(updatePost.rejected, (draft, action) => {
        draft.updatePostLoading = false;
        draft.updatePostError = action.error;
      })
      .addCase(removePost.pending, (draft, action) => {
        draft.removePostLoading = true;
        draft.removePostDone = false;
        draft.removePostError = null;
      })
      .addCase(removePost.fulfilled, (draft, action) => {
        draft.removePostLoading = false;
        draft.removePostDone = true;
        draft.mainPosts = draft.mainPosts.filter(
          (v) => v.id !== action.payload.PostId
        );
      })
      .addCase(removePost.rejected, (draft, action) => {
        draft.removePostLoading = false;
        draft.removePostError = action.error;
      })
      .addCase(addComment.pending, (draft, action) => {
        draft.addCommentLoading = true;
        draft.addCommentDone = false;
        draft.addCommentError = null;
      })
      .addCase(addComment.fulfilled, (draft, action) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        ); // action.payload.PostId는 back의 router의 PostId는에서 가져오므로 대문자.
        console.log("draft", draft, "post", post, "Comments", post?.Comments);
        post?.Comments.unshift(action.payload);
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
      })
      .addCase(addComment.rejected, (draft, action) => {
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
      })
      .addCase(likePost.pending, (draft, action) => {
        draft.likePostLoading = true;
        draft.likePostDone = false;
        draft.likePostError = null;
      })
      .addCase(likePost.fulfilled, (draft, action) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        if (post && post.Likers) {
          post.Likers.push({ id: action.payload.UserId });
        }
        draft.likePostLoading = false;
        draft.likePostDone = true;
      })
      .addCase(likePost.rejected, (draft, action) => {
        draft.likePostLoading = false;
        draft.likePostError = action.error;
      })
      .addCase(unlikePost.pending, (draft, action) => {
        draft.unlikePostLoading = true;
        draft.unlikePostDone = false;
        draft.unlikePostError = null;
      })
      .addCase(unlikePost.fulfilled, (draft, action) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        if (post && post.Likers) {
          post.Likers = post.Likers.filter(
            (v) => v.id !== action.payload.UserId
          );
        }
        draft.unlikePostLoading = false;
        draft.unlikePostDone = true;
      })
      .addCase(unlikePost.rejected, (draft, action) => {
        draft.unlikePostLoading = false;
        draft.unlikePostError = action.error;
      })
      .addDefaultCase((state) => state);
  },
});

export default postSlice;
