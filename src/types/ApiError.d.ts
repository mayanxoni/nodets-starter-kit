export class ApiError extends Error {
	statusCode: number;

	isOperational: boolean;

	constructor(statusCode: number, message: string, isOperational?: boolean, stack?: string);
}
