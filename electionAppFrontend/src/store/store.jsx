import { configureStore } from "@reduxjs/toolkit";
import { electionApi } from "../apis/electionApi";

const store = configureStore({
  reducer: {
    [electionApi.reducerPath]: electionApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(electionApi.middleware),
});

export default store;
