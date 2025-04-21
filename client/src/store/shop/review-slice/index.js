import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    reviews : []
}

const backendURL = import.meta.env.VITE_BACKEND_URI

export const addReview = createAsyncThunk("/review/addReview",
    async (formdata) => {
        const response = await axios.post(
            `${backendURL}/api/shop/review/add`,formdata
        );
        return response.data;
    }
)

export const getReview = createAsyncThunk("/review/getReview",
    async (id) => {
        const response = await axios.get(
            `${backendURL}/api/shop/review/${id}`
        );
        return response.data;
    }
)


const reviewSlice = createSlice({
    name : 'reviewSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(getReview.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getReview.fulfilled, (state, action) => {
            state.isLoading = false,
            state.reviews = action.payload.data
        })
        .addCase(getReview.rejected, (state) => {
            state.isLoading = false
            state.reviews = []
        })
    }
})

export default reviewSlice.reducer;