import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
  teams: [], // Stores a list of teams
  selectedTeam: null, // Stores the currently selected team
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      // console.log("🟢 Setting teams in Redux:", action.payload); // ✅ Debugging

      // Ensure the payload is valid, otherwise default to an empty array
      state.teams = Array.isArray(action.payload) ? action.payload : [];
    },
    appendTeam : (state , action) => {
      state.teams.push(action.payload);
    },
    selectTeam: (state, action) => {
      // console.log("🔵 Selecting team:", action.payload); // ✅ Debugging
      state.selectedTeam = action.payload || [];
    },
    clearTeams: (state) => {
      // console.log("🟠 Clearing teams from Redux"); // ✅ Debugging
      state.teams = []; // Reset teams on logout or error
      state.selectedTeam = null;
    },
  },
});

export const { setTeams, selectTeam, clearTeams , appendTeam} = teamSlice.actions;
export default teamSlice.reducer;
