import { API_BASE_URL } from "@/lib/api"
import { BaseReducerState } from "@/redux/store"
import { getRequest, postRequest } from "@/lib/requests"
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { UserDTO } from "@/modules/User"

export type UserState = BaseReducerState<UserDTO>

export const fetchRegisterUser = createAsyncThunk(
   "user/fetchRegisterUser",
   (user: { username: string; password: string }, { rejectWithValue }) => postRequest(API_BASE_URL + "/auth/register", user, {
         withCredentials: true,
      })
         .then((res) => res.data as UserDTO)
         .catch((err) => {
            const { statusCode, message, error } = err.response.data
            return rejectWithValue(message)
         })
)

export const fetchLoginUser = createAsyncThunk(
   "user/fetchLoginUser",
   (user: { username: string; password: string }, { rejectWithValue }) => postRequest(API_BASE_URL + "/auth/login", user, {
         withCredentials: true,
      })
         .then((res) => res.data as UserDTO)
         .catch((err) => {
            const { statusCode, message, error } = err.response.data
            return rejectWithValue(message)
         })
)

export const fetchGetUser = createAsyncThunk(
   "user/fetchGetUser",
   (_, { rejectWithValue }) => getRequest(API_BASE_URL + "/user/get", {
         withCredentials: true,
      })
         .then((res) => res.data as UserDTO)
         .catch((err) => {
            const { statusCode, message, error } = err.response.data

            try {
               window.localStorage.removeItem("lastLogin")
            } catch (ex) {}

            return rejectWithValue(message)
         })
)

const initialState: UserState = {
   data: {
      id: null,
      username: null,
      name: null,
      creationDate: null,
   },
   isLoading: true, // to prevent flashing, initially starts to load anyway
   error: null,
}

export const userSlice = createSlice({
   name: "user",
   initialState,
   reducers: {
      setIsLoading: (state, action: PayloadAction<boolean>) => {
         state.isLoading = action.payload
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchRegisterUser.fulfilled, (state, action) => {
            state.data = action.payload
            window.localStorage.setItem(
               "lastLogin",
               JSON.stringify({ id: state.data.id, date: new Date() })
            )
         })
         .addCase(fetchLoginUser.fulfilled, (state, action) => {
            state.data = action.payload
            window.localStorage.setItem(
               "lastLogin",
               JSON.stringify({ id: state.data.id, date: new Date() })
            )
         })
         .addCase(fetchGetUser.fulfilled, (state, action) => {
            state.data = action.payload
         })
         .addMatcher(
            (action) =>
               action.type.startsWith("user/") && action.type.endsWith("/pending"),
            (state, action) => {
               state.isLoading = true
               state.error = null
            }
         )
         .addMatcher(
            (action) =>
               action.type.startsWith("user/") && action.type.endsWith("/fulfilled"),
            (state, action) => {
               state.isLoading = false
               state.error = null
            }
         )
         .addMatcher(
            (action) =>
               action.type.startsWith("user/") && action.type.endsWith("/rejected"),
            (state, action) => {
               state.isLoading = false
               state.error = action.payload
            }
         )
   },
})

export const { setIsLoading: setIsUserLoading } = userSlice.actions

export const userReducer = userSlice.reducer
