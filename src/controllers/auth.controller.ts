import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import * as emailService from '../services/email.service';
import * as tokenService from '../services/token.service';
import * as userService from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import customResponse from '../utils/customResponse';
import responseManager from '../utils/responseManager';

export const register = catchAsync(async (req: Request, res: Response) => {
	const user = await userService.createUser(req.body);
	if (user.code !== responseManager.CREATED.code) {
		return customResponse(res, user);
	}
	const tokens = await tokenService.generateAuthTokens(user.data);
	const response = {
		code: responseManager.SUCCESS.code,
		message: 'Registered successfully',
		data: {
			user: user.data,
			tokens
		}
	};
	return customResponse(res, response);
});

export const login = catchAsync(async (req: Request, res: Response) => {
	const { email, password } = req.body;
	const user = await authService.loginUserWithEmailAndPassword(email, password);
	if (user.code !== responseManager.SUCCESS.code) {
		return customResponse(res, user);
	}
	const tokens = await tokenService.generateAuthTokens(user.data);
	const response = {
		code: responseManager.SUCCESS.code,
		message: 'Logged in successfully',
		data: {
			user: user.data,
			tokens
		}
	};
	return customResponse(res, response);
});

export const logout = catchAsync(async (req: Request, res: Response) => {
	const response = await authService.logout(req.body.refreshToken);
	return customResponse(res, response);
});

export const refreshTokens = catchAsync(async (req: Request, res: Response) => {
	const response = await authService.refreshAuth(req.body.refreshToken);
	return customResponse(res, response);
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
	const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
	await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
	return customResponse(res, { code: responseManager.SUCCESS.code, message: 'Reset password email sent' });
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
	const response = await authService.resetPassword(req.query.token as string, req.body.password);
	return customResponse(res, response);
});

export const sendVerificationEmail = catchAsync(async (req: Request, res: Response) => {
	const userEmail = (req.user as any)?.email;
	if (!userEmail) {
		return customResponse(res, { code: responseManager.BAD_REQUEST.code, message: 'User email not found' });
	}
	const verifyEmailToken = await tokenService.generateVerifyEmailToken(userEmail);
	await emailService.sendVerificationEmail(userEmail, verifyEmailToken);
	return customResponse(res, { code: responseManager.SUCCESS.code, message: 'Verification email sent' });
});

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
	const response = await authService.verifyEmail(req.query.token as string);
	return customResponse(res, response);
});
