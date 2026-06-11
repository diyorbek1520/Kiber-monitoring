// Express Router phishing endpointlarini alohida route modulida boshqarish uchun ishlatiladi.
import { Router } from 'express';

// asyncHandler async controller xatolarini error middlewarega uzatish uchun ishlatiladi.
import { asyncHandler } from '../utils/asyncHandler.js';

// analyzeFishing phishing tahlil so'rovini controllerga ulash uchun ishlatiladi.
import { analyzeFishing } from '../controllers/fishingController.js';

// requireAuth phishing tahlil natijalarini kirgan foydalanuvchiga bog'lash uchun ishlatiladi.
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAuth, asyncHandler(analyzeFishing));
export default router;
