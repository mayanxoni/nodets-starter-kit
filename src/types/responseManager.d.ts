export interface IResponseManagerCode {
	code: number;
	message: string;
}

export interface IResponseManager {
	SUCCESS: IResponseManagerCode;
	CREATED: IResponseManagerCode;
	BAD_REQUEST: IResponseManagerCode;
	UNAUTHORIZED: IResponseManagerCode;
	FORBIDDEN: IResponseManagerCode;
	NOT_FOUND: IResponseManagerCode;
	INVALID_TOKEN: IResponseManagerCode;
	[key: string]: IResponseManagerCode;
}

export const responseManager: IResponseManager;
