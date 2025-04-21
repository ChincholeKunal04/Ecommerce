import Order from "../../models/Order.model.js";

const getAllOrdersOfAllUsers = async (req, res) => { 
    try {

        const orders = await Order.find({});

        if(!orders.length){
            return res.status(404).json({
                success : false,
                message : 'Orders not found'
            })
        }

        res.status(200).json({
            success : true,
            data : orders
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while fetching all order"
        })
    }
}

const getOrderDetailsForAdmin = async (req, res) => { 
    try {

        const { id } = req.params;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success : false,
                message : 'Order not found'
            })
        }

        res.status(200).json({
            success : true,
            data : order
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while fetching order details"
        })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orederStatus } = req.body;

        const order = await Order.findById(id);

        if(!order){
            return res.status(404).json({
                success : false,
                message : 'Order not found'
            })
        }

        await Order.findByIdAndUpdate(id, {
            orederStatus
        })

        res.status(200).json({
            success : true,
            message : "Order ststus is update successfully"
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while update order details"
        })
    }
}

export {
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
}