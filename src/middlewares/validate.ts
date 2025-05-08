/* eslint-disable no-redeclare */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import Joi, { ObjectSchema } from 'joi';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';

type SchemaObject = Record<string, ObjectSchema<any>>;

function validate(schema: ObjectSchema<any>): (req: Request, res: Response, next: NextFunction) => void;
function validate(schema: SchemaObject): (req: Request, res: Response, next: NextFunction) => void;
function validate(schema: ObjectSchema<any> | SchemaObject) {
	return (req: Request, res: Response, next: NextFunction) => {
		let validSchema: SchemaObject;
		let object: Record<string, any>;
		if (typeof (schema as any).validate === 'function') {
			// Single Joi schema
			validSchema = { body: schema as ObjectSchema<any> };
			object = { body: req.body };
		}
		else {
			// Object with possible body/query/params
			validSchema = pick(schema as SchemaObject, ['params', 'query', 'body']) as SchemaObject;
			object = pick(req as Record<string, any>, Object.keys(validSchema));
		}
		const { value, error } = Joi.compile(validSchema)
			.prefs({ errors: { label: 'key' }, abortEarly: false })
			.validate(object);
		if (error) {
			const errorMessage = error.details.map((details: any) => details.message).join(', ');
			return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
		}
		Object.assign(req, value);
		return next();
	};
}

export default validate;
