import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../slice/counterSlice";

const store = configureStore({
  reducer: {
    // Add your reducers here
    counter:counterReducer,
  },
});
export default store;

