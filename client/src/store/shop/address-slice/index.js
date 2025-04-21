import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    addressList : []
}

const backendURL = import.meta.env.VITE_BACKEND_URI

export const addNewAddress = createAsyncThunk('/addresses/addNewAddress', 
    async(formData) => {
        const response = await axios.post(`${backendURL}/api/shop/address/add`, formData);
        return response?.data;
    }
)

export const fetchAllAddresses = createAsyncThunk('/addresses/fetchAllAddresses', 
    async(userId) => {
        const response = await axios.get(`${backendURL}/api/shop/address/get/${userId}`);
        return response?.data;
    }
)

export const editAddress = createAsyncThunk('/addresses/editAddress', 
    async({userId, addressId, formData}) => {
        const response = await axios.put(`${backendURL}/api/shop/address/update/${userId}/${addressId}`, formData);
        return response?.data;
    }
)

export const deleteAddress = createAsyncThunk('/addresses/deleteAddress', 
    async({userId, addressId}) => {
        const response = await axios.delete(`${backendURL}/api/shop/address/delete/${userId}/${addressId}`);
        return response?.data;
    }
)

const addressSlice = createSlice({
    name : 'address',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(addNewAddress.pending, (state) => {
            state.isLoading = true
        })
        .addCase(addNewAddress.fulfilled, (state, action) => {
            state.isLoading = false
        })
        .addCase(addNewAddress.rejected, (state) => {
            state.isLoading = false
        })
        .addCase(fetchAllAddresses.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.isLoading = false,
            state.addressList = action.payload.data
        })
        .addCase(fetchAllAddresses.rejected, (state) => {
            state.isLoading = false,
            state.addressList = []
        })
        .addCase(editAddress.pending, (state) => {
            state.isLoading = true
        })
        .addCase(editAddress.fulfilled, (state, action) => {
            state.isLoading = false,
            state.addressList = action.payload.data
        })
        .addCase(editAddress.rejected, (state) => {
            state.isLoading = false,
            state.addressList = []
        })
        .addCase(deleteAddress.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteAddress.fulfilled, (state, action) => {
            state.isLoading = false
        })
        .addCase(deleteAddress.rejected, (state) => {
            state.isLoading = false
        })
    },
})

export default addressSlice.reducer;