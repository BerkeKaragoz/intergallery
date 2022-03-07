import { MediaDTO } from "@/lib/Media";
import { BaseReducerState, RootState } from "@/redux/store";
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export interface MediaState extends BaseReducerState<{}> {}

const adapter = createEntityAdapter<MediaDTO>();

const initialState = adapter.getInitialState<MediaState>({
  data: {},
  isLoading: false,
  error: null,
});

export const mediaSlice = createSlice({
  name: "media",
  initialState,
  reducers: {
    upsertMany: adapter.upsertMany,
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action) =>
          action.type.startsWith("media/") && action.type.endsWith("/pending"),
        (state, action) => {
          state.isLoading = true;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("media/") &&
          action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.isLoading = false;
          state.error = null;
        },
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("media/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        },
      );
  },
});

export const { upsertMany: upsertManyMedia } = mediaSlice.actions;

export const mediaSelectors = adapter.getSelectors<RootState>(
  (state) => state.media,
);

export const mediaReducer = mediaSlice.reducer;
