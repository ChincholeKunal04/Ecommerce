import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isLoading : false,
    cartItems : [],
}

const backendURL = import.meta.env.VITE_BACKEND_URI

export const addToCart = createAsyncThunk('cart/addToCart', 
    async({userId, productId, quantity}) => {
        const response = await axios.post(`${backendURL}/api/shop/cart/add`,
            {
                userId, 
                productId, 
                quantity
            }
        );
        return response?.data;
    }
)

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', 
    async(userId) => {
        const response = await axios.get(`${backendURL}/api/shop/cart/get/${userId}`
        );
        return response?.data;
    }
)

export const deleteCartItem = createAsyncThunk('cart/deleteCartItem', 
    async({userId, productId}) => {
        const response = await axios.delete(`${backendURL}/api/shop/cart/${userId}/${productId}`
        );
        return response?.data;
    }
)

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', 
    async({userId, productId, quantity}) => {
        const response = await axios.put(`${backendURL}/api/shop/cart/update-cart`,
            {
                userId, 
                productId, 
                quantity
            }
        );
        return response?.data;
    }
)

const shoppingCartSLice = createSlice({
    name : "shoppingCart",
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(addToCart.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
        })
        .addCase(addToCart.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        .addCase(fetchCartItems.pending, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
        })
        .addCase(fetchCartItems.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        .addCase(updateCartQuantity.pending, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        .addCase(updateCartQuantity.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
        })
        .addCase(updateCartQuantity.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        .addCase(deleteCartItem.pending, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
        .addCase(deleteCartItem.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data;
        })
        .addCase(deleteCartItem.rejected, (state) => {
            state.isLoading = false;
            state.cartItems = [];
        })
    }
})

export default shoppingCartSLice.reducer;