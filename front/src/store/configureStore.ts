import { configureStore } from "@reduxjs/toolkit";
// import { useDispatch } from "react-redux";

import rootReducer from "../reducers";

const store = configureStore({
  reducer: rootReducer,
});

export default store;
// 먼저 내보내고 아래 type들을 내보낼 수 있음.

// store.dispatch(fetchUser());
// import userReducer, { fetchUser } from './reducer'; 일경우

//RootState, AppDispatch의 경우 후에 Typed hook을 만들기 위해서 사용
// useSelector 사용시 타입으로 사용하기 위함.
export type RootState = ReturnType<typeof store.getState>;

// useDispatch를 좀 더 명확하게 사용하기 위함.
export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch: () => AppDispatch = useDispatch;
