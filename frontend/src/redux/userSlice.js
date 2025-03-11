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


// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   userId: null,
//   name: "",
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.userId = action.payload.userId;
//       state.name = action.payload.name;
//     },
//     clearUser: (state) => {
//       state.userId = null;
//       state.name = "";
//     },
//   },
// });

// export const { setUser, clearUser } = userSlice.actions;
// export default userSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Start with null, avoid reading localStorage on first render
  isAuthenticated: false, // Track authentication status
};

// Helper function to store user data securely
const saveUserToStorage = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

// Helper function to clear user data from storage
const clearUserFromStorage = () => {
  localStorage.removeItem("user");
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true; // Mark user as logged in
      saveUserToStorage(action.payload);
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false; // Mark user as logged out
      clearUserFromStorage();
    },
    loadUserFromStorage: (state) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        state.user = storedUser;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { setUser, clearUser, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;
