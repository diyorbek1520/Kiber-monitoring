// Express Router hisobot endpointlarini alohida route modulida boshqarish uchun ishlatiladi.
import { Router } from 'express';

// asyncHandler async controller xatolarini error middlewarega uzatish uchun ishlatiladi.
import { asyncHandler } from '../utils/asyncHandler.js';

// Report controllerlar hisobot ro'yxati va PDF yuklab olishni boshqarish uchun ishlatiladi.
import { downloadReport, getReports } from '../controllers/reportController.js';

// requireAuth hisobotlarni faqat kirgan foydalanuvchiga tegishli yozuvlar bilan cheklash uchun ishlatiladi.
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.get('/', requireAuth, asyncHandler(getReports));
router.get('/:id/pdf', requireAuth, asyncHandler(downloadReport));
export default router;
