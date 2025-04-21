import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from "dotenv";
import authRouter from './routes/auth/auth.route.js'

import adminProductsRouter from './routes/admin/products.route.js'
import adminOrderRouter from './routes/admin/order.route.js'

import shopProductsRouter from './routes/shop/products.route.js'
import shopCartRouter from './routes/shop/cart.route.js';
import shopAddressRouter from './routes/shop/address.route.js'
import shopOrderRouter from './routes/shop/order.route.js'
import shopSearchRouter from './routes/shop/search.route.js'
import shopReviewRouter from './routes/shop/review.route.js'

import commonFeatureRouter from './routes/common/feature.route.js'
 
dotenv.config()

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))     
    .catch((err) => console.log(err)) 

const app = express()
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        origin : "http://localhost:5173",
        methods : ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders : [
            "Content-Type",
            "Autherization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials : true
    })
);

app.use(cookieParser());
app.use(express.json());
app.use('/api/auth', authRouter);

app.use('/api/admin/products', adminProductsRouter)
app.use('/api/admin/orders', adminOrderRouter)

app.use('/api/shop/products', shopProductsRouter)
app.use('/api/shop/cart', shopCartRouter)
app.use('/api/shop/address', shopAddressRouter)
app.use('/api/shop/order', shopOrderRouter)
app.use('/api/shop/search', shopSearchRouter)
app.use('/api/shop/review', shopReviewRouter)

app.use('/api/common/feature', commonFeatureRouter)

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`)
)
