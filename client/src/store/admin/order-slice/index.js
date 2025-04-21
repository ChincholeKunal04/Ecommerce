import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const initialState = {
    orderList : [],
    orderDetails : null
}

const backendURL = import.meta.env.VITE_BACKEND_URI

export const getAllOrdersForAdmin = createAsyncThunk('/order/getAllOrdersForAdmin',
    async() => {
        const response = await axios.get(`${backendURL}/api/admin/orders/get`);

        return response.data;
    }
)

export const getOrderDetailsForAdmin = createAsyncThunk('/order/getOrderDetailsForAdmin',
    async(id) => {
        const response = await axios.get(`${backendURL}/api/admin/orders/details/${id}`);
        return response.data;
    }
)

export const updateOrderStatus = createAsyncThunk('/order/updateOrderStatus',
    async({id, orederStatus}) => {
        const response = await axios.put(`${backendURL}/api/admin/orders/update/${id}`, {orederStatus});
        return response.data;
    }
)

const adminOrderSlice = createSlice({
    name : 'adminOrderSlice',
    initialState,
    reducers : {
        resetOrderDetails : (state) => {
            state.orderDetails = null;
        }
    },
    extraReducers : (builder) => {
        builder
        .addCase(getAllOrdersForAdmin.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getAllOrdersForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderList = action.payload.data;
        })
        .addCase(getAllOrdersForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderList = [];
        })
        .addCase(getOrderDetailsForAdmin.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(getOrderDetailsForAdmin.fulfilled, (state, action) => {
            state.isLoading = false;
            state.orderDetails = action.payload.data;
        })
        .addCase(getOrderDetailsForAdmin.rejected, (state) => {
            state.isLoading = false;
            state.orderDetails = null
        })        
    }
})

export const {resetOrderDetails} = adminOrderSlice.actions;
export default adminOrderSlice.reducer;