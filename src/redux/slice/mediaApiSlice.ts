import { API_BASE_URL } from "@/lib/api";
import { CreateMediaInputDTO, MediaDTO, MediaEntity } from "@/lib/Media";
import { GetMediaInputDTO } from "@/lib/Media/media";
import { PaginatedDTO } from "@/lib/types";
// Import the RTK Query methods from the React-specific entry point
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const mediaApiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  reducerPath: "api",
  // All of our requests will have URLs starting with '/fakeApi'
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),

  tagTypes: ["Media"],
  // The "endpoints" represent operations and requests for this server
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getMedia: builder.query<PaginatedDTO<MediaDTO>, GetMediaInputDTO>({
      // The URL for the request is '/fakeApi/posts'
      query: (query) => ({ url: "/media/user", params: query }),
      providesTags: (result, error, page) =>
        result
          ? [
              // Provides a tag for each post in the current page,
              // as well as the 'PARTIAL-LIST' tag.
              ...result.data.map(({ id }) => ({ type: "Media" as const, id })),
              { type: "Media", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Media", id: "PARTIAL-LIST" }],
    }),
    getMediaById: builder.query<MediaDTO, MediaDTO["id"]>({
      query: (mediaId) => ({ url: `/media/${mediaId}` }),
    }),
    postMedia: builder.mutation<
      MediaEntity,
      CreateMediaInputDTO | CreateMediaInputDTO[]
    >({
      query: (media) => ({
        url: "/media",
        method: "POST",
        body: media,
      }),
      // Invalidates the tag for `PARTIAL-LIST`,
      // causing the `listPosts` query to re-fetch if a component is subscribed to the query.
      invalidatesTags: (result, error) => [
        { type: "Media", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const { useGetMediaQuery, useGetMediaByIdQuery, usePostMediaMutation } =
  mediaApiSlice;
