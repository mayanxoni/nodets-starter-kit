import { tokenTypes } from '../config/tokens';
import { Token, User } from '../models';
import responseManager from '../utils/responseManager';
import * as tokenService from './token.service';
import { getUserByEmail } from './user.service';

export const loginUserWithEmailAndPassword = async (email: string, password: string) => {
	const userResult = await getUserByEmail(email);
	if (!('data' in userResult) || !userResult.data || !(await userResult.data.isPasswordMatch(password))) {
		return {
			code: responseManager.UNAUTHORIZED.code,
			message: 'Incorrect email or password'
		};
	}
	return {
		code: responseManager.SUCCESS.code,
		message: 'Logged in',
		data: userResult.data
	};
};

export const logout = async (refreshToken: string) => {
	const refreshTokenDoc = await Token.findOne({
		token: refreshToken,
		type: tokenTypes.REFRESH,
		blacklisted: false
	});
	if (!refreshTokenDoc) {
		return {
			code: responseManager.NOT_FOUND.code,
			message: 'Refresh token not found'
		};
	}
	await refreshTokenDoc.remove();
	return {
		code: responseManager.SUCCESS.code,
		message: 'Logged out'
	};
};

export const refreshAuth = async (refreshToken: string) => {
	try {
		const refreshTokenDoc = await tokenService.verifyToken(refreshToken, tokenTypes.REFRESH);
		const user = await User.findById(refreshTokenDoc.user);
		if (!user) {
			return {
				code: responseManager.NOT_FOUND.code,
				message: 'User not found'
			};
		}
		await refreshTokenDoc.remove();
		const tokens = await tokenService.generateAuthTokens(user);
		return {
			code: responseManager.SUCCESS.code,
			message: 'Tokens refreshed',
			data: tokens
		};
	}
	catch (error) {
		return {
			code: responseManager.UNAUTHORIZED.code,
			message: 'Could not refresh tokens'
		};
	}
};

// TODO: Implement actual password reset logic
// For now, return a dummy ApiResponse
export const resetPassword = async (resetPasswordToken: string, newPassword: string) => ({
	code: responseManager.SUCCESS.code,
	message: 'Password reset (dummy implementation)'
});

// TODO: Implement actual email verification logic
// For now, return a dummy ApiResponse
export const verifyEmail = async (verifyEmailToken: string) => ({
	code: responseManager.SUCCESS.code,
	message: 'Email verified (dummy implementation)'
});
