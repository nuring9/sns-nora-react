import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User, FollowersType } from "../types";
// interface MyError {  // 추후 에러 타입 변경 시 참고.
//   message: string;
//   code: number;
// }

interface UserState {
  logInLoading: boolean; // 로그인 시도중
  logInDone: boolean;
  logInError: unknown;
  loadMyInfoLoading: boolean; // 유저 정보 가져오기 시도중
  loadMyInfoDone: boolean;
  loadMyInfoError: unknown;
  loadUserLoading: boolean;
  loadUserDone: boolean;
  loadUserError: unknown;
  logOutLoading: boolean; // 로그아웃 시도중
  logOutDone: boolean;
  logOutError: unknown;
  signUpLoading: boolean; // 회원가입 시도중
  signUpDone: boolean;
  signUpError: unknown; // 추후 타입 변경 생각해보기..
  changeNicknameLoading: boolean; // 닉네임 변경 시도중
  changeNicknameDone: boolean;
  changeNicknameError: unknown;
  followLoading: boolean; // 팔로우 시도중
  followDone: boolean;
  followError: unknown;
  unfollowLoading: boolean; // 언팔로우 시도중
  unfollowDone: boolean;
  unfollowError: unknown;
  loadFollowingsLoading: boolean;
  loadFollowingsDone: boolean;
  loadFollowingsError: unknown;
  loadFollowersLoading: boolean;
  loadFollowersDone: boolean;
  loadFollowersError: unknown;
  removeFollowerLoading: boolean;
  removeFollowerDone: boolean;
  removeFollowerError: unknown;
  message?: string;
  me: User | null; // 사용자 정보 객체 타입
  userInfo: User | null;
  // signUpDate: number;
  // loginDate: number;
}

const initialState: UserState = {
  me: null,
  userInfo: null,
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  loadMyInfoLoading: false, // 유저 정보 가져오기 시도중
  loadMyInfoDone: false,
  loadMyInfoError: null,
  loadUserLoading: false,
  loadUserDone: false,
  loadUserError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
  changeNicknameLoading: false, // 닉네임 변경 시도중
  changeNicknameDone: false,
  changeNicknameError: null,
  followLoading: false, // 팔로우 시도중
  followDone: false,
  followError: null,
  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false,
  unfollowError: null,
  loadFollowingsLoading: false,
  loadFollowingsDone: false,
  loadFollowingsError: null,
  loadFollowersLoading: false,
  loadFollowersDone: false,
  loadFollowersError: null,
  removeFollowerLoading: false,
  removeFollowerDone: false,
  removeFollowerError: null,
};

//액션이름 "user/logIn"
export const logIn = createAsyncThunk("user/logIn", async (data: User) => {
  const response = await axios.post("/user/login", data);
  return response.data;
});

export const loadMyInfo = createAsyncThunk("user/loadMyInfo", async () => {
  const response = await axios.get("/user");
  return response.data || null;
});

export const loadUser = createAsyncThunk(
  "user/loadUser",
  async (data: number) => {
    const response = await axios.get(`/user/${data}`);
    return response.data;
  }
);

export const loadFollowings = createAsyncThunk(
  "user/loadFollowings",
  async (data: any) => {
    const response = await axios.get("/user/followings", data);
    return response.data;
  }
);

export const loadFollowers = createAsyncThunk(
  "user/loadFollowers",
  async (data: any) => {
    const response = await axios.get("/user/followers", data);
    return response.data;
  }
);

export const follow = createAsyncThunk(
  "user/follow",
  async (data: FollowersType) => {
    const response = await axios.patch(`/user/${data.userId}/follow`);
    return response.data;
  }
);

export const unfollow = createAsyncThunk(
  "user/unfollow",
  async (data: FollowersType) => {
    const response = await axios.delete(`/user/${data.userId}/follow`);
    return response.data;
  }
);
export const removeFollower = createAsyncThunk(
  "user/removeFollower",
  async (data: number) => {
    const response = await axios.delete(`/user/follower/${data}`);
    return response.data;
  }
);

export const logOut = createAsyncThunk("user/logOut", async (data: User) => {
  const response = await axios.post("/user/logout", data);
  return response.data;
});

export const signUp = createAsyncThunk("user/signUp", async (data: User) => {
  const response = await axios.post("/user/signup", data);
  return response.data;
});

export const changeNickname = createAsyncThunk(
  "user/changeNickname",
  async (data: { nickname: string }) => {
    const response = await axios.patch("/user/nickname", { nickname: data });
    return response.data;
  }
);

const userSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    addPostToMe(draft, action) {
      // draft.me.Posts.unshift({ id: action.payload });
      // draft.me가 있을때만 unshift
      if (draft.me) {
        draft.me.Posts?.unshift({ id: action.payload });
      }
    },
    removePostOfMe(draft, action) {
      // draft.me.Posts = draft.me.Posts.filter(
      //   (v: any) => v.id !== action.payload
      // );
      // draft.me 가 있을 때만 filter
      if (draft.me) {
        draft.me.Posts = draft.me.Posts?.filter(
          (v: any) => v.id !== action.payload
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMyInfo.pending, (draft) => {
        draft.loadMyInfoLoading = true;
        draft.loadMyInfoError = null;
        draft.loadMyInfoDone = false;
      })
      .addCase(loadMyInfo.fulfilled, (draft, action) => {
        draft.loadMyInfoLoading = false;
        draft.me = action.payload || null;
        draft.loadMyInfoDone = true;
      })
      .addCase(loadMyInfo.rejected, (draft, action) => {
        draft.loadMyInfoLoading = false;
        draft.loadMyInfoError = action.error;
      })
      .addCase(logIn.pending, (state) => {
        state.logInLoading = true;
        state.logInError = null;
        state.logInDone = false;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.logInLoading = false;
        state.me = action.payload;
        state.logInDone = true;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.logInLoading = false;
        state.logInError = action.error.message;
      })
      .addCase(loadFollowings.pending, (draft) => {
        draft.loadFollowingsLoading = true;
        draft.loadFollowingsError = null;
        draft.loadFollowingsDone = false;
      })
      .addCase(loadFollowings.fulfilled, (draft, action) => {
        draft.loadFollowingsLoading = false;
        // draft.me.Followings = action.payload;
        if (draft.me) {
          draft.me.Followings = action.payload;
        }
        draft.loadFollowingsDone = true;
      })
      .addCase(loadFollowings.rejected, (draft, action) => {
        draft.loadFollowingsLoading = false;
        draft.loadFollowingsError = action.error;
      })
      .addCase(loadFollowers.pending, (draft) => {
        draft.loadFollowersLoading = true;
        draft.loadFollowersError = null;
        draft.loadFollowersDone = false;
      })
      .addCase(loadFollowers.fulfilled, (draft, action) => {
        draft.loadFollowersLoading = false;
        // draft.me.Followers = action.payload;
        if (draft.me) {
          draft.me.Followers = action.payload;
        }
        draft.loadFollowersDone = true;
      })
      .addCase(loadFollowers.rejected, (draft, action) => {
        draft.loadFollowersLoading = false;
        draft.loadFollowersError = action.error;
      })
      .addCase(loadUser.pending, (draft) => {
        draft.loadUserLoading = true;
        draft.loadUserError = null;
        draft.loadUserDone = false;
      })
      .addCase(loadUser.fulfilled, (draft, action) => {
        draft.loadUserLoading = false;
        draft.userInfo = action.payload;
        draft.loadUserDone = true;
      })
      .addCase(loadUser.rejected, (draft, action) => {
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
      })
      .addCase(follow.pending, (draft) => {
        draft.followLoading = true;
        draft.followError = null;
        draft.followDone = false;
      })
      .addCase(follow.fulfilled, (draft, action) => {
        draft.followLoading = false;
        // draft.me.Followings.push({ id: action.payload.UserId });
        // draft.me와 draft.me.Followings가 null이거나 선택적선언이(옵셔널체이닝)이기때문에 if문으로 확실히 해줘야함.
        if (draft.me && draft.me.Followings) {
          draft.me.Followings.push({ id: action.payload.UserId });
        }
        draft.followDone = true;
      })
      .addCase(follow.rejected, (draft, action) => {
        draft.followLoading = false;
        draft.followError = action.error;
      })
      .addCase(unfollow.pending, (draft) => {
        draft.unfollowLoading = true;
        draft.unfollowError = null;
        draft.unfollowDone = false;
      })
      .addCase(unfollow.fulfilled, (draft, action) => {
        draft.unfollowLoading = false;
        // draft.me.Followings = draft.me.Followings.filter(
        //   (v: any) => v.id !== action.payload.UserId
        // );
        //draft.me와 draft.me.Followings가 null이거나 선택적선언이(옵셔널체이닝)이기때문에 if문으로 확실히 해줘야함.
        if (draft.me && draft.me.Followings) {
          draft.me.Followings = draft.me.Followings.filter(
            (v: any) => v.id !== action.payload.UserId
          );
        }
        draft.unfollowDone = true;
      })
      .addCase(unfollow.rejected, (draft, action) => {
        draft.unfollowLoading = false;
        draft.unfollowError = action.error;
      })
      .addCase(removeFollower.pending, (state) => {
        state.removeFollowerLoading = true;
        state.removeFollowerError = null;
        state.removeFollowerDone = false;
      })
      .addCase(removeFollower.fulfilled, (state, action) => {
        state.removeFollowerLoading = false;
        // state.me.Followers = state.me?.Followers?.filter(
        //   (v: any) => v.id !== action.payload.UserId
        // );
        // state.me와 state.me.Followers가 null이거나 선택적선언이(옵셔널체이닝)이기때문에 if문으로 확실히 해줘야함.
        if (state.me && state.me.Followers) {
          state.me.Followers = state.me.Followers.filter(
            (follower) => follower.id !== action.payload.UserId
          );
        }
        state.removeFollowerDone = true;
      })
      .addCase(removeFollower.rejected, (draft, action) => {
        draft.removeFollowerLoading = false;
        draft.removeFollowerError = action.error;
      })
      .addCase(logOut.pending, (draft) => {
        draft.logOutLoading = true;
        draft.logOutError = null;
        draft.logOutDone = false;
      })
      .addCase(logOut.fulfilled, (draft) => {
        draft.logOutLoading = false;
        draft.logOutDone = true;
        draft.me = null;
      })
      .addCase(logOut.rejected, (draft, action) => {
        draft.logOutLoading = false;
        draft.logOutError = action.error;
      })
      .addCase(signUp.pending, (draft) => {
        draft.signUpLoading = true;
        draft.signUpError = null;
        draft.signUpDone = false;
      })
      .addCase(signUp.fulfilled, (draft) => {
        draft.signUpLoading = false;
        draft.signUpDone = true;
      })
      .addCase(signUp.rejected, (draft, action) => {
        draft.signUpLoading = false;
        draft.signUpError = action.error;
      })
      .addCase(changeNickname.pending, (draft) => {
        draft.changeNicknameLoading = true;
        draft.changeNicknameError = null;
        draft.changeNicknameDone = false;
      })
      .addCase(changeNickname.fulfilled, (draft, action) => {
        // draft.me가 null일 수도 있기때문에 if문으로 확실하게..
        if (draft.me) {
          draft.me.nickname = action.payload.nickname;
        }
        draft.changeNicknameLoading = false;
        draft.changeNicknameDone = true;
      })
      .addCase(changeNickname.rejected, (draft, action) => {
        draft.changeNicknameLoading = false;
        draft.changeNicknameError = action.payload;
      })
      .addDefaultCase((state) => state);
  },
});

export default userSlice;
