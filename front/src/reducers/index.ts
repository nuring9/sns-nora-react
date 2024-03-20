import { combineReducers } from "@reduxjs/toolkit";
import axios from "axios";

import userSlice from "./user";
import postSlice from "./post";

import { backUrl } from "@src/config/config";

axios.defaults.baseURL = backUrl;
axios.defaults.withCredentials = true;

const rootReducer = combineReducers({
  user: userSlice.reducer,
  post: postSlice.reducer,
});

export default rootReducer;
