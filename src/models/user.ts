import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
	email: string;
	clientId: string;
	refreshToken: string;
}

const userSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		clientId: {
			type: String,
			required: true,
		},
		refreshToken: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const objectModel = model<IUser>('User', userSchema);
export default objectModel;
