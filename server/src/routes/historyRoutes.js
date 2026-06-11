// Express Router tarix endpointlarini alohida route modulida boshqarish uchun ishlatiladi.
import { Router } from 'express';

// asyncHandler async controller xatolarini error middlewarega uzatish uchun ishlatiladi.
import { asyncHandler } from '../utils/asyncHandler.js';

// getHistory saqlangan tahlil tarixini qaytarish uchun ishlatiladi.
import { getHistory } from '../controllers/historyController.js';

// requireAuth tarixni faqat kirgan foydalanuvchiga tegishli yozuvlar bilan cheklash uchun ishlatiladi.
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', requireAuth, asyncHandler(getHistory));
export default router;
