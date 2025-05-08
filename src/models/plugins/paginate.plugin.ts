/* eslint-disable no-param-reassign */
import { Document, Model, Schema } from 'mongoose';

interface QueryOptions {
	sortBy?: string;
	populate?: string;
	limit?: number;
	page?: number;
}

function paginate<T extends Document, M extends Model<T>>(schema: Schema<T, M>) {
	// eslint-disable-next-line func-names
	schema.statics.paginate = async function (filter: any, options: QueryOptions = {}) {
		let sort = '';
		if (options.sortBy) {
			const sortingCriteria: string[] = [];
			options.sortBy.split(',').forEach((sortOption) => {
				const [key, order] = sortOption.split(':');
				sortingCriteria.push((order === 'desc' ? '-' : '') + key);
			});
			sort = sortingCriteria.join(' ');
		}
		else {
			sort = 'createdAt';
		}

		const limit = options.limit && Number(options.limit) > 0 ? Number(options.limit) : 10;
		const page = options.page && Number(options.page) > 0 ? Number(options.page) : 1;
		const skip = (page - 1) * limit;

		const countPromise = this.countDocuments(filter);
		let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

		if (options.populate) {
			options.populate.split(',').forEach((populateOption) => {
				docsPromise = docsPromise.populate(populateOption.trim());
			});
		}

		return Promise.all([countPromise.exec(), docsPromise.exec()]).then((values) => {
			const [totalResults, results] = values;
			const totalPages = Math.ceil(totalResults / limit);
			return {
				results,
				page,
				limit,
				totalPages,
				totalResults
			};
		});
	};
}

export default paginate;
