import { API_BASE_URL } from "@/lib/api";
import { CreateMediaInputDTO, MediaDTO, MediaEntity } from "@/modules/Media";
import {
  DeleteMediaInputDTO,
  GetMediaInputDTO,
  UpdateMediaInputDTO,
} from "@/modules/Media/utils";
import { PaginatedDTO } from "@/lib/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const mediaApiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL, credentials: "include" }),

  tagTypes: ["Media"],
  endpoints: (builder) => ({
    getMedia: builder.query<PaginatedDTO<MediaDTO>, GetMediaInputDTO>({
      query: (query) => ({ url: "/media/user", params: query }),
      providesTags: (result, error, page) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Media" as const, id })),
              { type: "Media", id: "PARTIAL-LIST" },
            ]
          : [{ type: "Media", id: "PARTIAL-LIST" }],
    }),
    getMediaById: builder.query<MediaDTO, MediaDTO["id"]>({
      query: (mediaId) => ({ url: `/media/${mediaId}` }),
      providesTags: (result) =>
        result ? [{ type: "Media", id: result.id }] : [],
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
      invalidatesTags: (result, error) => [
        { type: "Media", id: "PARTIAL-LIST" },
      ],
    }),
    editMedia: builder.mutation<MediaEntity, UpdateMediaInputDTO>({
      query: (media) => ({
        url: "/media/update",
        method: "POST",
        body: media,
      }),
      invalidatesTags: (result, error) =>
        result ? [{ type: "Media", id: result.id }] : [],
    }),
    deleteMedia: builder.mutation<MediaEntity, DeleteMediaInputDTO>({
      query: (id) => ({
        url: "/media/delete",
        method: "POST",
        body: { id },
      }),
      invalidatesTags: (result, error) => [
        { type: "Media", id: "PARTIAL-LIST" },
      ],
    }),
  }),
});

// Export the auto-generated hook for the `getPosts` query endpoint
export const {
  useGetMediaQuery,
  useGetMediaByIdQuery,
  usePostMediaMutation,
  useEditMediaMutation,
  useDeleteMediaMutation,
} = mediaApiSlice;
