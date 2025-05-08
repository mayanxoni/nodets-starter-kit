import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import config from '../config/config';
import { tokenTypes } from '../config/tokens';
import { Token } from '../models';

export interface JwtPayload {
	sub: string;
	iat: number;
	exp: number;
	type: string;
}

export const generateToken = (userId: string, expires: Moment, type: string, secret: string = config.jwt.secret): string => {
	const payload: JwtPayload = {
		sub: userId,
		iat: moment().unix(),
		exp: expires.unix(),
		type
	};
	return jwt.sign(payload, secret);
};

export const saveToken = async (
	token: string,
	userId: string,
	expires: Moment,
	type: string,
	blacklisted: boolean = false
) => {
	const tokenDoc = await Token.create({
		token,
		user: userId,
		expires: expires.toDate(),
		type,
		blacklisted
	});
	return tokenDoc;
};

export const verifyToken = async (token: string, type: string) => {
	const payload = jwt.verify(token, config.jwt.secret) as JwtPayload;
	const tokenDoc = await Token.findOne({
		token,
		type,
		user: payload.sub,
		blacklisted: false
	});
	if (!tokenDoc) {
		throw new Error('Token not found');
	}
	return tokenDoc;
};

export const generateAuthTokens = async (user: any) => {
	const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
	const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS);

	const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
	const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH);
	await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH);

	const tokens = {
		access: {
			token: accessToken,
			expires: accessTokenExpires.toDate()
		},
		refresh: {
			token: refreshToken,
			expires: refreshTokenExpires.toDate()
		}
	};
	return tokens;
};

export const generateVerifyEmailToken = async (user: any) => {
	const expires = moment().add(config.jwt.verifyEmailExpirationMinutes, 'minutes');
	const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL);
	await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL);
	return verifyEmailToken;
};

export const generateResetPasswordToken = async (user: any) => {
	const expires = moment().add(config.jwt.resetPasswordExpirationMinutes, 'minutes');
	const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD);
	await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD);
	return resetPasswordToken;
};
