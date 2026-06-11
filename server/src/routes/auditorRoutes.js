// Express Router auditor endpointlarini alohida route modulida boshqarish uchun ishlatiladi.
import { Router } from 'express';

// asyncHandler async controller xatolarini error middlewarega uzatish uchun ishlatiladi.
import { asyncHandler } from '../utils/asyncHandler.js';

// auditTarget auditor so'rovini qabul qilib tekshiruvni boshlash uchun ishlatiladi.
import { auditTarget } from '../controllers/auditorController.js';

// requireAuth auditor natijalarini kirgan foydalanuvchiga bog'lash uchun ishlatiladi.
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAuth, asyncHandler(auditTarget));
export default router;
