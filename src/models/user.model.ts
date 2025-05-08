/* eslint-disable func-names */
import bcrypt from 'bcryptjs';
import mongoose, { Document, Model, Schema } from 'mongoose';
import validator from 'validator';
import { paginate, toJSON } from './plugins';
import { roles } from '../config/roles';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	isEmailVerified: boolean;
	isPasswordMatch(password: string): Promise<boolean>;
}

export interface UserModel extends Model<IUser> {
	isEmailTaken(email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean>;
	paginate(filter: any, options: any): Promise<any>;
}

const userSchema = new Schema<IUser, UserModel>(
	{
		name: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value: string) {
				if (!validator.isEmail(value)) {
					throw new Error('Invalid email');
				}
			}
		},
		password: {
			type: String,
			required: true,
			trim: true,
			minlength: 8,
			validate(value: string) {
				if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
					throw new Error('Password must contain at least one letter and one number');
				}
			},
			private: true // used by the toJSON plugin
		},
		role: {
			type: String,
			enum: roles,
			default: 'user'
		},
		isEmailVerified: {
			type: Boolean,
			default: false
		}
	},
	{
		timestamps: true
	}
);

(userSchema as Schema<any, any>).plugin(toJSON);
(userSchema as Schema<any, any>).plugin(paginate);

userSchema.statics.isEmailTaken = async function (email: string, excludeUserId?: mongoose.Types.ObjectId): Promise<boolean> {
	const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
	return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
	const user = this as IUser;
	return bcrypt.compare(password, user.password);
};

userSchema.pre<IUser>('save', async function (next) {
	const user = this;
	if (user.isModified('password')) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
