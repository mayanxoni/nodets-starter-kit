import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { roleRights } from '../config/roles';
import customResponse from '../utils/customResponse';
import responseManager from '../utils/responseManager';

// TODO: Add proper User type
// eslint-disable-next-line max-len, consistent-return
const verifyCallback =	(req: Request, resolve: () => void, _reject: (err?: any) => void, requiredRights: string[], res: Response) => async (err: any, user: any, info: any) => {
	if (err || info || !user) {
		if (info && info.message === 'jwt expired') {
			return customResponse(res, {
				code: responseManager.INVALID_TOKEN.code,
				message: responseManager.INVALID_TOKEN.message
			});
		}
		return customResponse(res, {
			code: responseManager.UNAUTHORIZED.code,
			message: responseManager.UNAUTHORIZED.message
		});
	}
	// @ts-ignore
	req.user = user;

	if (requiredRights.length) {
		const userRights = roleRights.get(user.role);
		const hasRequiredRights = requiredRights.every((requiredRight) => (userRights ?? []).includes(requiredRight));
		// @ts-ignore
		if (!hasRequiredRights && req.params.userId !== user.id) {
			return customResponse(res, {
				code: responseManager.FORBIDDEN.code,
				message: responseManager.FORBIDDEN.message
			});
		}
	}

	resolve();
};

const auth = (...requiredRights: string[]) => (req: Request, res: Response, next: NextFunction) => new Promise<void>((resolve, reject) => {
	passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject, requiredRights, res))(
		req,
		res,
		next
	);
})
	.then(() => next())
	.catch((err) => next(err));

export default auth;
