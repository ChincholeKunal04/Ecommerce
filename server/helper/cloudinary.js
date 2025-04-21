import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name : 'dr1ciknsp',
    api_key : '294775392299532',
    api_secret : 'p8znEL1_17Xz5k_A1JcjVy46-mk',
});

const storage = new multer.memoryStorage();

async function imageUploadUtils(file) {
    const result = await cloudinary.uploader.upload(file, {
        resource_type : 'auto',
    });

    return result;
}

const upload = multer({storage});

export { upload, imageUploadUtils }