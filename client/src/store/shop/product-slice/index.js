import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading : false,
    productList : [],
    productDetails : null
}

const backendURL = import.meta.env.VITE_BACKEND_URI

export const fetchAllFilteredProducts = createAsyncThunk('/products/fetchAllFilteredProducts',
    async({filterParams, sortParams}) => {
        const query = new URLSearchParams({
            ...filterParams,
            sortBy : sortParams
        });

        const result = await axios.get(
            `${backendURL}/api/shop/products/get?${query}`
        );

        return result?.data;
    }
);

export const fetchProductDetails = createAsyncThunk('/products/fetchProductDetails',
    async(id) => {
        const result = await axios.get(
            `${backendURL}/api/shop/products/get/${id}`
        );

        return result?.data;
    }
);

const shoppingProductSlice = createSlice({
    name : 'shoppingProduct',
    initialState,
    reducers : {
        setProductDetails : (state) => {
            state.productDetails = null
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(fetchAllFilteredProducts.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
            // console.log('API Response Payload:', action.payload);
            state.isLoading = false
            state.productList = action.payload?.data || [];
        })
        .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
            state.isLoading = false
            state.productList = []
        })
        .addCase(fetchProductDetails.pending, (state, action) => {
            state.isLoading = true
        })
        .addCase(fetchProductDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.productDetails = action.payload.data
        })
        .addCase(fetchProductDetails.rejected, (state, action) => {
            state.isLoading = false
            state.productDetails = null
        })
    }
})

export const {setProductDetails} = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;