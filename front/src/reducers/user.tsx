import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  isLoggedIn: boolean;
  me: any; // 사용자 정보 객체 타입
  signUpDate: number; // Date 객체 대신 timestamp(Number)으로 변경
  loginDate: number; // Date 객체 대신 timestamp(Number)으로 변경
}

const initialState: UserState = {
  isLoggedIn: false,
  me: null,
  signUpDate: Date.now(), // Date 객체 대신 timestamp(Number)으로 초기화
  loginDate: Date.now(), // Date 객체 대신 timestamp(Number)으로 초기화
  // 다른 상태들을 추가할 수 있습니다.
};

const userSlice = createSlice({
  name: "me",
  initialState,
  reducers: {
    logIn(state, action) {
      state.me = action.payload;
      state.isLoggedIn = !!action.payload; // 사용자 객체가 있으면 로그인 상태로 간주
      state.loginDate = Date.now(); // 로그인 시간 업데이트
    },
    logOut(state) {
      state.me = null;
      state.isLoggedIn = false;
      state.loginDate = Date.now(); // 로그아웃 시간 업데이트
    },
    // 다른 액션들을 추가할 수 있습니다.
    getInitialState: () => initialState,
  },
});

export const { logIn, logOut } = userSlice.actions;
export default userSlice;
