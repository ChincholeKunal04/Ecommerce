import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : true,
    featureImageList : []
};

const backendURL = import.meta.env.VITE_BACKEND_URI

export const getFeatureImages = createAsyncThunk('/auth/getFeatureImages',
    async() => {
        const response = await axios.get(`${backendURL}/api/common/feature/get`);

        return response.data;
    }
)

export const addFeatureImages = createAsyncThunk('/auth/addFeatureImages',
    async(image) => {
        const response = await axios.post(`${backendURL}/api/common/feature/add`, 
            {image}

        );

        return response.data;
    }
)

const commonSlice = createSlice({
    name : 'commonSlice',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder
        .addCase(getFeatureImages.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getFeatureImages.fulfilled, (state, action) => {
            state.isLoading = false,
            state.featureImageList = action.payload.data
        })
        .addCase(getFeatureImages.rejected, (state) => {
            state.isLoading = false,
            state.featureImageList = []
        })
    }
})

export default commonSlice.reducer;