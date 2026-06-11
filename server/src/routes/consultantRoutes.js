// Express Router maslahatchi endpointlarini alohida route modulida boshqarish uchun ishlatiladi.
import { Router } from 'express';

// asyncHandler async controller xatolarini error middlewarega uzatish uchun ishlatiladi.
import { asyncHandler } from '../utils/asyncHandler.js';

// consult foydalanuvchi savolini maslahatchi controlleriga yuborish uchun ishlatiladi.
import { consult } from '../controllers/consultantController.js';

// requireAuth maslahatchi javoblarini kirgan foydalanuvchiga bog'lash uchun ishlatiladi.
import { requireAuth } from '../middleware/authMiddleware.js';

const router = Router();
router.post('/', requireAuth, asyncHandler(consult));
export default router;
