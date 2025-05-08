import { User } from '../models';
import responseManager from '../utils/responseManager';

export const createUser = async (userBody: any) => {
	if (await User.isEmailTaken(userBody.email)) {
		return {
			code: responseManager.BAD_REQUEST.code,
			message: 'Email already taken'
		};
	}
	const user = await User.create(userBody);
	if (!user) {
		return {
			code: responseManager.INTERNAL_SERVER_ERROR.code,
			message: 'Failed to create user'
		};
	}
	return {
		code: responseManager.CREATED.code,
		message: 'User created',
		data: user
	};
};

export const queryUsers = async (filter: any, options: any) => {
	const users = await User.paginate(filter, options);
	if (!users.results.length) {
		return {
			code: responseManager.NOT_FOUND.code,
			message: 'Users not found',
			data: []
		};
	}
	return {
		code: responseManager.SUCCESS.code,
		message: 'Users retrieved',
		data: users
	};
};

export const getUserById = async (id: string) => {
	const user = await User.findById(id);
	if (!user) {
		return {
			code: responseManager.NOT_FOUND.code,
			message: 'User not found'
		};
	}
	return {
		code: responseManager.SUCCESS.code,
		message: 'User retrieved',
		data: user
	};
};

export const getUserByEmail = async (email: string) => {
	const user = await User.findOne({ email });
	if (!user) {
		return {
			code: responseManager.NOT_FOUND.code,
			message: 'User not found'
		};
	}
	return {
		code: responseManager.SUCCESS.code,
		message: 'User retrieved',
		data: user
	};
};

// TODO: Implement actual update logic
// For now, return a dummy ApiResponse
export const updateUserById = async (userId: string, updateBody: any) => ({
	code: responseManager.SUCCESS.code,
	message: 'User updated (dummy implementation)'
});

// TODO: Implement actual delete logic
// For now, return a dummy ApiResponse
export const deleteUserById = async (userId: string) => ({
	code: responseManager.SUCCESS.code,
	message: 'User deleted (dummy implementation)'
});
