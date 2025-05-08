import express from 'express';
import { authController } from '../../controllers';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { authValidation } from '../../validations';

const router = express.Router();

router.post('/register', validate(authValidation.register.body), authController.register);
router.post('/login', validate(authValidation.login.body), authController.login);
router.post('/logout', validate(authValidation.logout.body), authController.logout);
router.post('/refresh-tokens', validate(authValidation.refreshTokens.body), authController.refreshTokens);
router.post('/forgot-password', validate(authValidation.forgotPassword.body), authController.forgotPassword);
router.post(
	'/reset-password',
	validate(authValidation.resetPassword.query),
	validate(authValidation.resetPassword.body),
	authController.resetPassword
);
router.post('/send-verification-email', auth(), authController.sendVerificationEmail);
router.post('/verify-email', validate(authValidation.verifyEmail.query), authController.verifyEmail);

export default router;
