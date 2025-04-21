import Feature from "../../models/Features.model.js"

const addFeaturesImage = async (req, res) => {
    try {
        const {image} = req.body;

        // console.log(image);

        const featureImages = new Feature({
            image
        })

        await featureImages.save();

        res.status(201).json({
            success : true,
            data : featureImages
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Error while add feature image"
        })
    }
}

const getFeaturesImage = async (req, res) => {
    try {
        const images = await Feature.find({})

        res.status(200).json({
            success : true,
            data : images
        })

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Error while getting feature image"
        })
    }
}

export {
    addFeaturesImage,
    getFeaturesImage
}
