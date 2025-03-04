import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Use localStorage as the default storage
import { combineReducers } from "redux";

// Configure persist settings
const persistConfig = {
  key: "root",
  storage,
};

// Combine reducers (in case you add more reducers later)
const rootReducer = combineReducers({
  user: userReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required to avoid errors with redux-persist
    }),
});

// Create a persistor
export const persistor = persistStore(store);
export default store;
