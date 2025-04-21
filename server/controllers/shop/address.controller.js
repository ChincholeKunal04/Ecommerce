import Address from "../../models/Address.model.js";

const addAddress = async (req, res) => {
    try {
        const {userId, address, city, pincode, phone, notes} = req.body;

        if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({
                success :false,
                message : "Invalid data provided"
            })
        }

        const newAddress = new Address({
            userId, address, city, pincode, phone, notes
        })

        await newAddress.save();

        res.status(201).json({
            success : true,
            data : newAddress
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while add address"
        })
    }
}

const fetchAllAddress = async (req, res) => {
    try {

        const { userId } = req.params;
        if(!userId){
            return res.status(400).json({
                success : false,
                message : "userId is required"
            })
        }

        const addressList = await Address.find({userId})

        res.status(200).json({
            success : true,
            data : addressList
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while fetching add address"
        })
    }
}

const editAddress = async (req, res) => {
    try {

        const { userId, addressId } = req.params;
        const formData = req.body;

        if(!userId || !addressId){
            return res.status(400).json({
                success : false,
                message : "userId and addressId is required"
            })
        }

        const address = await Address.findOneAndUpdate(
            {
                _id : addressId, userId
            }, 
            formData, 
            { new : true }
        );
        
        if(!address){
            return res.status(400).json({
                success : false,
                message : "address not found"
            })
        }

        res.status(200).json({
            success : true,
            data : address
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while edit address"
        })
    }
}

const deleteAdress = async (req, res) => {
    try {

        const { userId, addressId } = req.params;
        if(!userId || !addressId){
            return res.status(400).json({
                success : false,
                message : "userId and addressId is required"
            })
        }

        const address = await Address.findOneAndDelete({
            _id : addressId,
            userId
        })

        if(!address){
            return res.status(400).json({
                success : false,
                message : "address not found"
            })
        }

        res.status(200).json({
            success : true,
            message : "Address deleted successfully"
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success : false,
            message : "Error while delete address"
        })
    }
}

export {
    addAddress,
    fetchAllAddress,
    editAddress,
    deleteAdress
}