import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

const initialState = {
    data:  null,
    status: 'loading'
}

export const fetchAuth = createAsyncThunk('auth/fetchUserData ',async (params) => {
    const data = axios.post('/auth/login', params) // params (store for email & password)
    return data
})

export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe ',async () => {
    const data = axios.get('/auth/me')
    return data
})

export const fetchRegister = createAsyncThunk('auth/fetchRegister ',async (params) => {
    const data = axios.post('/auth/register', params)
    return data
})

 const authSlice = createSlice({
     name: 'auth',
     initialState,
     reducers: {
         logout: (state) => {
             state.data = null
             state.status = 'loaded'
         }
     },
     extraReducers: {
         [fetchAuth.pending]: (state) => {
             state.status = 'loading';
             state.data = null;
         },
         [fetchAuth.fulfilled]: (state, action) => {
             state.status = 'loaded';
             state.data = action.payload;
         },
         [fetchAuth.rejected]: (state) => {
             state.status = 'error';
             state.data = null;
         },
         [fetchAuthMe.pending]: (state) => {
             state.status = 'loading';
             state.data = null;
         },
         [fetchAuthMe.fulfilled]: (state, action) => {
             state.status = 'loaded';
             state.data = action.payload;
         },
         [fetchAuthMe.rejected]: (state) => {
             state.status = 'error';
             state.data = null;
         },
         [fetchRegister.pending]: (state) => {
             state.status = 'loading';
             state.data = null;
         },
         [fetchRegister.fulfilled]: (state, action) => {
             state.status = 'loaded';
             state.data = action.payload;
         },
         [fetchRegister.rejected]: (state) => {
             state.status = 'error';
             state.data = null;
         },
     }
 })

export const selectIsAuth = state => Boolean(state.auth.data) // проверка есть ли в auth данные

export const authReducer = authSlice.reducer

export const {logout} = authSlice.actions