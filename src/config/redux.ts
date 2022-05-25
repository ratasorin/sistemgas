import { configureStore } from "@reduxjs/toolkit";
import blur from "components/Content/blur.slice";

export const store = configureStore({
  reducer: {
    blur,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
