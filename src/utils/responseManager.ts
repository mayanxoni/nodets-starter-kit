import status from 'http-status';

const responseManager = {
	SUCCESS: {
		code: status.OK,
		message: status[200]
	},
	CREATED: {
		code: status.CREATED,
		message: status[201]
	},
	ACCEPTED: {
		code: status.ACCEPTED,
		message: status[202]
	},
	NO_CONTENT: {
		code: status.NO_CONTENT,
		message: status[204]
	},
	BAD_REQUEST: {
		code: status.BAD_REQUEST,
		message: status[400]
	},
	UNAUTHORIZED: {
		code: status.UNAUTHORIZED,
		message: status[401]
	},
	FORBIDDEN: {
		code: status.FORBIDDEN,
		message: status[403]
	},
	NOT_FOUND: {
		code: status.NOT_FOUND,
		message: status[404]
	},
	INTERNAL_SERVER_ERROR: {
		code: status.INTERNAL_SERVER_ERROR,
		message: status[500]
	},
	INVALID_TOKEN: {
		code: status.extra?.unofficial?.INVALID_TOKEN,
		message: status.extra?.unofficial?.[498]
	}
};

export default responseManager;
