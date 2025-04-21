import express from 'express';
import { addFeaturesImage, getFeaturesImage } from '../../controllers/common/feature.controller.js';

const router = express.Router();

router.post("/add", addFeaturesImage);
router.get("/get", getFeaturesImage);

export default router;