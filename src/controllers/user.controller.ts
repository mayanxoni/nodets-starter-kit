import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import catchAsync from '../utils/catchAsync';
import customResponse from '../utils/customResponse';
import pick from '../utils/pick';
import responseManager from '../utils/responseManager';

export const createUser = catchAsync(async (req: Request, res: Response) => {
	const response = await userService.createUser(req.body);
	if (!response) {
		return customResponse(res, {
			code: 404,
			message: 'User not created'
		});
	}
	return customResponse(res, response);
});

export const getUsers = catchAsync(async (req: Request, res: Response) => {
	const filter = pick(req.query, ['name', 'role']);
	const options = pick(req.query, ['sortBy', 'limit', 'page']);
	const response = await userService.queryUsers(filter, options);
	if (!response || (Array.isArray(response.data?.results) && response.data.results.length === 0)) {
		return customResponse(res, {
			code: responseManager.NOT_FOUND.code,
			message: 'Users not found',
			data: []
		});
	}
	return customResponse(res, response);
});

export const getUser = catchAsync(async (req: Request, res: Response) => {
	const response = await userService.getUserById(req.params.userId);
	return customResponse(res, response);
});

export const updateUser = catchAsync(async (req: Request, res: Response) => {
	const response = await userService.updateUserById(req.params.userId, req.body);
	return customResponse(res, response);
});

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
	const response = await userService.deleteUserById(req.params.userId);
	return customResponse(res, response);
});
