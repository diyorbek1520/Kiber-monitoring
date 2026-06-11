// Express Router autentifikatsiya endpointlarini alohida modulda boshqarish uchun ishlatiladi.
import { Router } from 'express';

// Auth controllerlar ro'yxatdan o'tish, kirish va profilni boshqarish uchun ishlatiladi.
import { getProfile, login, register, updateProfile } from '../controllers/authController.js';

// requireAuth profil endpointlarini faqat kirgan foydalanuvchiga ochish uchun ishlatiladi.
import { requireAuth } from '../middleware/authMiddleware.js';

// asyncHandler async controller xatolarini error middlewarega uzatish uchun ishlatiladi.
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.get('/me', requireAuth, asyncHandler(getProfile));
router.patch('/me', requireAuth, asyncHandler(updateProfile));

export default router;
