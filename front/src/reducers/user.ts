// import { createSlice } from "@reduxjs/toolkit";

// interface UserState {
//   isLoggedIn: boolean;
//   me: any; // 사용자 정보 객체 타입
//   signUpDate: number; // Date 객체 대신 timestamp(Number)으로 변경
//   loginDate: number; // Date 객체 대신 timestamp(Number)으로 변경
// }

// const initialState: UserState = {
//   isLoggedIn: false,
//   me: null,
//   signUpDate: Date.now(), // Date 객체 대신 timestamp(Number)으로 초기화
//   loginDate: Date.now(), // Date 객체 대신 timestamp(Number)으로 초기화
// };

// const userSlice = createSlice({
//   name: "me",
//   initialState,
//   reducers: {
//     logIn(state, action) {
//       state.me = action.payload;
//       state.isLoggedIn = !!action.payload; // 사용자 객체가 있으면 로그인 상태로 간주
//       state.loginDate = Date.now(); // 로그인 시간 업데이트
//     },
//     logOut(state) {
//       state.me = null;
//       state.isLoggedIn = false;
//       state.loginDate = Date.now(); // 로그아웃 시간 업데이트
//     },
//     // 다른 액션들을 추가할 수 있습니다.
//     getInitialState: () => initialState,
//   },
// });

// export const { logIn, logOut } = userSlice.actions;
// export default userSlice;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  logInLoading: boolean;
  logInDone: boolean;
  logInError: any;
  logOutLoading: boolean; // 로그아웃 시도중
  logOutDone: boolean;
  logOutError: any;
  message?: string;
  me: any; // 사용자 정보 객체 타입
  // signUpDate: number; // Date 객체 대신 timestamp(Number)으로 변경
  // loginDate: number; // Date 객체 대신 timestamp(Number)으로 변경
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
};

export const logIn = createAsyncThunk("user/logIn", async (data) => {
  const response = await axios.post("/user/login", data);
  return response.data;
});

export const logOut = createAsyncThunk("user/logOut", async (data) => {
  const response = await axios.post("user/logout", data);
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
      .addDefaultCase((state) => state);
  },
});

export default userSlice;
