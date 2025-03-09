// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload; 
//     },
//     logout: (state) => {
//       state.user = null; 
//     },
//   },
// });

// export const { setUser, logout } = userSlice.actions;
// export default userSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  name: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
    },
    clearUser: (state) => {
      state.userId = null;
      state.name = "";
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
