import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';
import { User } from '../models';
import config from './config';
import { tokenTypes } from './tokens';

const jwtOptions: StrategyOptions = {
	secretOrKey: config.jwt.secret,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const jwtVerify = async (payload: any, done: any) => {
	try {
		if (payload.type !== tokenTypes.ACCESS) {
			throw new Error('Invalid token type');
		}
		const user = await User.findById(payload.sub);
		if (!user) {
			return done(null, false);
		}
		return done(null, user);
	}
	catch (error) {
		return done(error, false);
	}
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

export { jwtStrategy };
