import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  teams: [], // Stores a list of teams
  selectedTeam: null, // Stores the currently selected team
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload; // Update the list of teams
    },
    selectTeam: (state, action) => {
      state.selectedTeam = action.payload; // Set the selected team
    },
    clearTeams: (state) => {
      state.teams = []; // Reset teams on logout or error
      state.selectedTeam = null;
    },
  },
});

export const { setTeams, selectTeam, clearTeams } = teamSlice.actions;
export default teamSlice.reducer;
