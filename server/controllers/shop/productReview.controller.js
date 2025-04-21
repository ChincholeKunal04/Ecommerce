import Review from "../../models/Review.model.js";
import Order from "../../models/Order.model.js"
import Product from "../../models/Product.models.js";

const addProductReview = async(req, res) => {
    try {
        const {productId, userId, userName, reviewMessage, reviewValue} = req.body;

        const order = await Order.findOne({
            userId,
            "cartItems.productId" : productId,
            orederStatus : 'Confirmed'
        })

        if(!order){
            return res.status(403).json({
                success : false,
                message : "You need to purchase this product"
            })
        }

        const checkExistingReview = await Review.findOne({
            productId,
            userId
        });

        if(checkExistingReview){
            return res.status(400).json({
                success : false,
                message : "You have already review this product"
            })
        }

        const newReview = new Review({
            productId, 
            userId, 
            userName, 
            reviewMessage, 
            reviewValue
        });

        await newReview.save();

        const reviews = await Review.find({productId})
        const totalReviewLength = reviews.length;
        const averageReview = reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) / totalReviewLength;

        await Product.findByIdAndUpdate(productId, {averageReview});

        res.status(201).json({
            success : true,
            data : newReview
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Error while adding review"
        })
    }
}

const getProductReview = async(req, res) => {
    try {
        const {productId} = req.params;

        const reviews = await Review.find({productId});

        res.status(200).json({
            success : true,
            data : reviews
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Error while get review"
        })
    }
}

export {
    addProductReview,
    getProductReview
}