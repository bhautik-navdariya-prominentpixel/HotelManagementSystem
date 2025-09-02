import { createSlice } from "@reduxjs/toolkit";
import { UserModel } from "../models/UserModel";

const initialState: {
  login: boolean;
  user: UserModel;
} = {
  login: false,
  user: new UserModel(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser(state, action) {
      state.user = action.payload;
      state.login = true;
      return state;
    },
    logOutUser(state) {
      state.login = false;
      state.user = new UserModel();
      return state;
    }
  },
});

export default authSlice;
export const { logOutUser, loginUser } = authSlice.actions;
