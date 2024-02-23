import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Post, CommentDataType, UpdatePostDataType } from "../types";
import axios from "axios";
import _ from "lodash";

interface PostsState {
  mainPosts: Post[];
  imagePaths: string[];
  hasMorePosts: boolean;
  singlePost: Post | null;
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
  uploadImagesLoading: boolean;
  uploadImagesDone: boolean;
  uploadImagesError: unknown;
  retweetLoading: boolean;
  retweetDone: boolean;
  retweetError: unknown;
}

const initialState: PostsState = {
  mainPosts: [],
  singlePost: null,
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
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  retweetLoading: false,
  retweetDone: false,
  retweetError: null,
};

const loadPostsThrottle = async (lastId: number) => {
  const response = await axios.get(`/posts?lastId=${lastId}`);
  return response.data;
};

// 게시글 목록
export const loadPosts = createAsyncThunk(
  "post/loadPosts",
  async (lastId: number) => {
    const loadPostsThrottled = _.throttle(loadPostsThrottle, 5000);
    return loadPostsThrottled(lastId);
  }
);
// export const loadPosts = createAsyncThunk(
//   "post/loadPosts",
//   _.throttle(loadPostsThrottle, 5000)
// );  // 원래 코드, 아래 코드 문제가 생기면 이 코드를 활성 화.

// 유저 게시글
const loadUserPostsThrottle = async (lastId: number, id: number) => {
  const response = await axios.get(`/user/${id}/posts?lastId=${lastId || 0}`);
  return response.data;
};

export const loadUserPosts = createAsyncThunk(
  "post/loadUserPosts",
  async ({ lastId, id }: { lastId: number; id: number }) => {
    const loadUserPostsThrottled = _.throttle(loadUserPostsThrottle, 5000);
    return loadUserPostsThrottled(lastId, id);
  }
);

// 해시태그 목록
const loadHashtagPostsThrottle = async (lastId: number, tag: string) => {
  const response = await axios.get(
    `/hashtag/${encodeURIComponent(tag)}?lastId=${lastId || 0}`
  );
  console.log("서버 응답 데이터:", response.data); // 서버 응답 데이터 출력
  return response.data;
};

export const loadHashtagPosts = createAsyncThunk(
  "post/loadHashtagPosts",
  async ({ lastId, tag }: { lastId: number; tag: string }) => {
    const loadHashtagPostsThrottled = _.throttle(
      loadHashtagPostsThrottle,
      5000
    );
    return loadHashtagPostsThrottled(lastId, tag);
  }
);

export const loadPost = createAsyncThunk(
  "post/loadPost",
  async (data: number) => {
    const response = await axios.get(`/post/${data}`);
    return response.data;
  }
);

export const addPost = createAsyncThunk(
  "post/addPost",
  async (data: FormData) => {
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

export const uploadImage = createAsyncThunk(
  "post/uploadImage",
  async (data: FormData) => {
    const response = await axios.post("/post/images", data);
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

// export const retweet = createAsyncThunk(
//   "post/retweet",
//   async (data: number) => {
//     const response = await axios.post(`/post/${data}/retweet`);
//     return response.data;
//   }
// );

export const retweet = createAsyncThunk(
  "post/retweet",
  async (data: number) => {
    try {
      const response = await axios.post(`/post/${data}/retweet`);
      return response.data;
    } catch (error: any) {
      if (error.response.status === 403) {
        throw new Error(error.response.data); // 403 에러가 발생하면 해당 메시지를 throw합니다.
      } else {
        throw error;
      }
    }
  }
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // removeImage 액션은 비동기가 아님. 동기 액션만 여기에 작성.
    // 보통 이미지는 서버에서 제거하지 않으므로 동기액션만 구현했는데, 나중에 서버에서도 제거가능하게 하려면 비동기로 전환.
    removeImage(state, action) {
      state.imagePaths = state.imagePaths.filter(
        (v, i) => i !== action.payload
      );
    },
  },
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
        draft.singlePost = action.payload;
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
        draft.imagePaths = []; // 이미지 초기화
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
        // console.log("draft", draft, "post", post, "Comments", post?.Comments);
        if (post?.Comments) {
          post.Comments.unshift(action.payload);
        }
        draft.addCommentLoading = false;
        draft.addCommentDone = true;
      })
      .addCase(addComment.rejected, (draft, action) => {
        draft.addCommentLoading = false;
        draft.addCommentError = action.error;
      })
      .addCase(uploadImage.pending, (draft, action) => {
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
      })
      .addCase(uploadImage.fulfilled, (draft, action) => {
        draft.imagePaths = draft.imagePaths.concat(action.payload);
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
      })
      .addCase(uploadImage.rejected, (draft, action) => {
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
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
      .addCase(retweet.pending, (draft, action) => {
        draft.retweetLoading = true;
        draft.retweetDone = false;
        draft.retweetError = null;
      })
      .addCase(retweet.fulfilled, (draft, action) => {
        draft.retweetLoading = false;
        draft.retweetDone = true;
        draft.mainPosts.unshift(action.payload);
        // 새로운 요소를 배열의 맨 앞쪽에 추가하고, 새로운 길이를 반환
      })
      .addCase(retweet.rejected, (draft, action) => {
        draft.retweetLoading = false;
        // draft.retweetError = action.error;
        draft.retweetError = action.error.message;
      })
      .addCase(loadUserPosts.pending, (draft, action) => {
        draft.loadPostsLoading = true;
        draft.loadPostsDone = false;
        draft.loadPostsError = null;
      })
      .addCase(loadUserPosts.fulfilled, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsDone = true;
        draft.mainPosts = draft.mainPosts.concat(action.payload);
        draft.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadUserPosts.rejected, (draft, action) => {
        draft.loadPostsLoading = false;
        draft.loadPostsError = action.error;
      })
      .addCase(loadHashtagPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadHashtagPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadHashtagPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addDefaultCase((state) => state);
  },
});

export default postSlice;
