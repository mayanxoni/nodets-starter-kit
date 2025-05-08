/* eslint-disable no-param-reassign */
import { Document, Model, Schema } from 'mongoose';

/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */
const deleteAtPath = (obj: any, path: string[], index: number) => {
	if (index === path.length - 1) {
		delete obj[path[index]];
		return;
	}
	deleteAtPath(obj[path[index]], path, index + 1);
};

function toJSON<T extends Document, M extends Model<T>>(schema: Schema<T, M>) {
	let transform: any;
	if ((schema as any).options && (schema as any).options.toJSON && (schema as any).options.toJSON.transform) {
		transform = (schema as any).options.toJSON.transform;
	}

	(schema as any).options = (schema as any).options || {};
	(schema as any).options.toJSON = Object.assign((schema as any).options.toJSON || {}, {
		// eslint-disable-next-line consistent-return
		transform(doc: any, ret: any, options: any) {
			Object.keys((schema as any).paths).forEach((path: string) => {
				if (
					(schema as any).paths[path]
					&& (schema as any).paths[path].options
					&& (schema as any).paths[path].options.private
				) {
					deleteAtPath(ret, path.split('.'), 0);
				}
			});

			ret.id = ret._id.toString();
			delete ret._id;
			delete ret.__v;
			delete ret.createdAt;
			delete ret.updatedAt;
			if (transform) {
				return transform(doc, ret, options);
			}
		}
	});
}

export default toJSON;
