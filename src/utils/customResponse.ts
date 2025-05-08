import { Response } from 'express';

interface ApiResponse {
	code: number;
	message: string;
	data?: any;
}

export default function customResponse(res: Response, response: ApiResponse) {
	const { code, message, data } = response;
	return res.status(code).json({
		code,
		message,
		data: data || {}
	});
}
