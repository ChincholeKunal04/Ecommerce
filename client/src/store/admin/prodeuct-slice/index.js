import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isLoading : false,
    productList :[],
}

const backendURL = import.meta.env.VITE_BACKEND_URI

export const addNewProduct = createAsyncThunk('/products/addnewproduct',
    async(formData) => {
        const result = await axios.post(`${backendURL}/api/admin/products/add`, formData, {
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        return result?.data;
    }
);

export const fetchallProducts = createAsyncThunk('/products/fetchallProducts',
    async() => {
        const result = await axios.get(`${backendURL}/api/admin/products/get`);
        return result?.data;
    }
);

export const editProduct = createAsyncThunk('/products/editProduct',
    async({id, formData}) => {
        const result = await axios.put(`${backendURL}/api/admin/products/edit/${id}`, formData, {
            headers : {
                'Content-Type' : 'application/json'
            }
        })
        return result?.data;
    }
);

export const deleteProduct = createAsyncThunk('/products/deleteProduct',
    async(id) => {
        const result = await axios.delete(`${backendURL}/api/admin/products/delete/${id}`)
        return result?.data;
    }
);

const AdminProductSlice = createSlice({
    name : 'adminProducts',
    initialState,
    reducers : {},
    extraReducers : (builder) => {
        builder.addCase(fetchallProducts.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchallProducts.fulfilled, (state, action) => {
            state.isLoading = false
            state.productList = action.payload?.data
        })
        .addCase(fetchallProducts.rejected, (state, action) => {
            state.isLoading = false
            state.productList =[]
            console.error("Error fetching products:", action.error);
        })
    },
})

export default AdminProductSlice.reducer