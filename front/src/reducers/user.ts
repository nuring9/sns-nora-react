import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../types";
// interface MyError {  // 추후 에러 타입 변경 시 참고.
//   message: string;
//   code: number;
// }

interface UserState {
  logInLoading: boolean; // 로그인 시도중
  logInDone: boolean;
  logInError: any;
  logOutLoading: boolean; // 로그아웃 시도중
  logOutDone: boolean;
  logOutError: any;
  signUpLoading: boolean; // 회원가입 시도중
  signUpDone: boolean;
  signUpError: any; // 추후 타입 변경 생각해보기..
  message?: string;
  me: any; // 사용자 정보 객체 타입
  // signUpDate: number;
  // loginDate: number;
}

const initialState: UserState = {
  me: null,
  // userInfo: null,
  logInLoading: false, // 로그인 시도중
  logInDone: false,
  logInError: null,
  logOutLoading: false, // 로그아웃 시도중
  logOutDone: false,
  logOutError: null,
  signUpLoading: false, // 회원가입 시도중
  signUpDone: false,
  signUpError: null,
};

//액션이름 "user/logIn"
export const logIn = createAsyncThunk("user/logIn", async (data) => {
  const response = await axios.post("/user/login", data);
  return response.data;
});

export const logOut = createAsyncThunk("user/logOut", async (data) => {
  const response = await axios.post("/user/logout", data);
  return response.data;
});

export const signUp = createAsyncThunk("user/signup", async (data: User) => {
  const response = await axios.post("/user", data);
  return response.data;
});

const userSlice = createSlice({
  name: "me",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addDefaultCase((state) => state);
  },
});

export default userSlice;
