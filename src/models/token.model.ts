import mongoose, { Document, Model, Schema } from 'mongoose';
import { tokenTypes } from '../config/tokens';
import { toJSON } from './plugins';

const { REFRESH, RESET_PASSWORD, VERIFY_EMAIL } = tokenTypes;

export interface IToken extends Document {
	token: string;
	user: mongoose.Types.ObjectId;
	type: string;
	expires: Date;
	blacklisted: boolean;
}

const tokenSchema = new Schema<IToken>(
	{
		token: {
			type: String,
			required: true,
			index: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true
		},
		type: {
			type: String,
			enum: [REFRESH, RESET_PASSWORD, VERIFY_EMAIL],
			required: true
		},
		expires: {
			type: Date,
			required: true
		},
		blacklisted: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

tokenSchema.plugin(toJSON);

const Token: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
