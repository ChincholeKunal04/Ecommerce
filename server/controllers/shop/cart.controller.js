import Cart from '../../models/Cart.model.js';
import Product from '../../models/Product.models.js';

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if(!userId || !productId || quantity <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid data provided'
            });
        }

        const product = await Product.findById(productId);

        if(!product) {
            return res.status(404).json({ 
                success: false,
                message: 'Product not found'
            });
        }

        let cart = await Cart.findOne({ userId });

        if(!cart) {
            cart = new Cart({userId, itmes : []});
        }

        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if(findCurrentProductIndex === -1){
            cart.items.push({ productId, quantity });
        }
        else {
            cart.items[findCurrentProductIndex].quantity += quantity;
        }

        await cart.save();

        res.status(201).json({
            success: true,
            data : cart
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error'
        });
    }
}

const fetchCartItems = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ 
                success: false, 
                message: 'UserId is required for fetching cart items' 
            });
        }

        const cart = await Cart.findOne({ userId })
            .populate({
                path: 'items.productId',
                select: 'image title price salePrice'
            });

        // console.log("Raw Cart Data:", JSON.stringify(cart, null, 2)); 

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found!'
            });
        }

        const populatedCartItems = cart.items.map(item => ({
            productId: item.productId?._id || null,
            image: item.productId?.image || null,
            title: item.productId?.title || null,
            price: item.productId?.price || null,
            salePrice: item.productId?.salePrice || null,
            quantity: item.quantity
        }));

        // console.log("Populated Cart Items:", populatedCartItems); 

        res.status(200).json({
            success: true,
            data: {
                ...cart._doc,
                items: populatedCartItems
            }
        });

    } catch (error) {
        console.error("etch Cart Error:", error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};


const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if(!userId || !productId || quantity <= 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid data provided'
            });
        }

        const cart = await Cart.findOne({ userId });

        if(!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found!'
            });
        }

        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if(findCurrentProductIndex === -1){
            return res.status(404).json({ 
                success: false,
                message: 'Product not found in cart !'
            });
        }

        cart.items[findCurrentProductIndex].quantity = quantity;

        await cart.save();
        
        await cart.populate({
            path : 'items.productId',
            select : 'image title price salePrice'
        })

        const populateCartItems = cart.items.map(item => ({
            productId : item.productId? item.productId._id : null,
            image : item.productId? item.productId.image : null,
            title : item.productId? item.productId.title : "Product not found",
            price : item.productId? item.productId.price : null,
            salePrice : item.productId? item.productId.salePrice : null,
            quantity : item.quantity
        }));

        res.status(200).json({
            success: true,
            data : {
                ...cart._doc,
                items : populateCartItems,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error'
        });
    }
}

const deleteCartItem = async (req, res) => {
    try {
        const {userId, productId} = req.params;

        if(!userId || !productId) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid data provided'
            });
        }

        const cart = await Cart.findOne({ userId  }).populate({
            path : 'items.productId',
            select : 'image title price salePrice',
        })

        if(!cart) {
            return res.status(404).json({ 
                success: false,
                message: 'Cart not found!'
            });
        }

        cart.items = cart.items.filter(item => item.productId._id.toString() !== productId)

        await cart.save();

        await Cart.findOne({ userId  }).populate({
            path : 'items.productId',
            select : 'image title price salePrice',
        })

        const populateCartItems = cart.items.map(item => ({
            productId : item.productId? item.productId._id : null,
            image : item.productId? item.productId.image : null,
            title : item.productId? item.productId.title : "Product not found",
            price : item.productId? item.productId.price : null,
            salePrice : item.productId? item.productId.salePrice : null,
            quantity : item.quantity
        }));

        res.status(200).json({
            success: true,
            data : {
                ...cart._doc,
                items : populateCartItems,
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error'
        });
    }
}

export { addToCart, updateCartItemQuantity, fetchCartItems, deleteCartItem }