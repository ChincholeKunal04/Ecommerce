import express from 'express';
import { upload } from '../../helper/cloudinary.js'
import { handelImageUpload, addProduct, fetchAllProducts, editProduct, deleteProduct } from "../../controllers/admin/products.controller.js"

const router = express.Router()

router.post('/upload-image', upload.single('my_file'), handelImageUpload)
router.post('/add', addProduct);
router.put('/edit/:id', editProduct);
router.delete('/delete/:id', deleteProduct);
router.get('/get', fetchAllProducts);

export default router;