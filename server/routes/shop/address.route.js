import express from 'express';
import { addAddress, fetchAllAddress, editAddress, deleteAdress } from "../../controllers/shop/address.controller.js";

const router = express.Router();

router.post('/add', addAddress);
router.get('/get/:userId', fetchAllAddress);
router.delete('/delete/:userId/:addressId', deleteAdress);
router.put('/update/:userId/:addressId', editAddress)

export default router;