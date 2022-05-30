import { mediaApiSlice } from "@/redux/slice/mediaApiSlice"
import { Nullable } from "@/lib/types"
import { userReducer } from "@/redux/slice/userSlice"
import { configureStore } from "@reduxjs/toolkit"

export const store = configureStore({
   reducer: {
      user: userReducer,
      [mediaApiSlice.reducerPath]: mediaApiSlice.reducer,
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mediaApiSlice.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export type BaseReducerState<T = void> = {
   error: null | string
   isLoading: boolean
} & (T extends void
   ? {}
   : {
        data: Nullable<T>
     })

export default store
