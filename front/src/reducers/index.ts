import { combineReducers } from "@reduxjs/toolkit";
// import axios from "axios";

import userSlice from "./user";
import postSlice from "./post";

// axios.defaults.baseURL = "http://localhost:3065";
// axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});

export default rootReducer;
