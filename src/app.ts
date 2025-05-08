import cors from 'cors';
import express, {
	Application, NextFunction, Request, Response
} from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import httpStatus from 'http-status';
import passport from 'passport';
import path from 'path';
import config from './config/config';
import morgan from './config/morgan';
import { jwtStrategy } from './config/passport';
import { errorConverter, errorHandler } from './middlewares/error';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import ApiError from './utils/ApiError';

const app: Application = express();

app.use(express.static(path.join(process.cwd(), 'public')));

if (config.env !== 'test') {
	app.use(morgan.successHandler);
	app.use(morgan.errorHandler);
}

app.disable('x-powered-by');

// set security HTTP headers
app.use(
	helmet({
		contentSecurityPolicy: false
	})
);

// parse json request body
app.use(
	express.json({
		limit: '100mb',
		// @ts-expect-error express.json doesn't accept 'extended'
		extended: true
	})
);

// parse urlencoded request body
app.use(
	express.urlencoded({
		limit: '100mb',
		extended: true,
		parameterLimit: 100000
	})
);

app.use(mongoSanitize());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
	app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
	next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
