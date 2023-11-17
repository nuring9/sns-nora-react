import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  user: any; // 사용자 정보 객체 타입
  signUpDate: number; // Date 객체 대신 timestamp(Number)으로 변경
  loginDate: number; // Date 객체 대신 timestamp(Number)으로 변경
}

const initialState: UserState = {
  isLoggedIn: false,
  user: null,
  signUpDate: Date.now(), // Date 객체 대신 timestamp(Number)으로 초기화
  loginDate: Date.now(), // Date 객체 대신 timestamp(Number)으로 초기화
  // 다른 상태들을 추가할 수 있습니다.
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn(state, action) {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload; // 사용자 객체가 있으면 로그인 상태로 간주
      state.loginDate = Date.now(); // 로그인 시간 업데이트
    },
    logOut(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.loginDate = Date.now(); // 로그아웃 시간 업데이트
    },
    // 다른 액션들을 추가할 수 있습니다.
    getInitialState: () => initialState,
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice;

// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";

// interface userState {
//   logInLoading: boolean;
//   logInDone: boolean;
//   logInError: string | null;
//   logOutLoading: boolean;
//   logOutDone: boolean;
//   logOutError: string | null;
//   user: string | null;
//   userInfo: string | null;
// }

// const initialState: userState = {
//   logInLoading: false, // 로그인 시도중
//   logInDone: false,
//   logInError: null,
//   logOutLoading: false, // 로그아웃 시도중
//   logOutDone: false,
//   logOutError: null,
//   user: null,
//   userInfo: null,
// };

// export const logIn = createAsyncThunk("user/logIn", async (data) => {
//   const response = await axios.post("user/login", data);
//   return response.data;
// });

// export const logout = createAsyncThunk("user/logout", async () => {
//   const response = await axios.post("user/logout");
//   return response.data;
// });

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     logout(state) {
//       state.logInDone = false;
//       state.user = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(logIn.pending, (state) => {
//         state.logInLoading = true;
//         state.logInError = null;
//         state.logInDone = false;
//       })
//       .addCase(logIn.fulfilled, (state, action: PayloadAction<any>) => {
//         state.logInLoading = false;
//         state.user = action.payload;
//         state.logInDone = true;
//       })
//       .addCase(logIn.rejected, (state, action: PayloadAction<any>) => {
//         state.logInLoading = false;
//         state.logInError = action.payload?.message ?? "Unknown error occurred";
//       })
//       .addCase(logout.pending, (draft) => {
//         draft.logOutLoading = true;
//         draft.logOutError = null;
//         draft.logOutDone = false;
//       })
//       .addCase(logout.fulfilled, (draft) => {
//         draft.logOutLoading = false;
//         draft.logOutDone = true;
//         draft.user = null;
//       })
//       .addCase(logout.rejected, (draft, action) => {
//         draft.logOutLoading = false;
//         draft.logOutError = action.error?.message ?? "An error occurred";
//       });
//   },
// });

// export default userSlice;
