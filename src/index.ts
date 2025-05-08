import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';

const PORT: number = Number(process.env.PORT) || 3000;
const ENV = process.env.NODE_ENV || 'development';

let server: import('http').Server;

mongoose
	.connect(config.mongoose.url, config.mongoose.options)
	.then(() => {
		if (logger) {
			logger.info('Connected to MongoDB');
		}
		else {
			console.log('Connected to MongoDB');
		}
		server = app.listen(PORT, () => {
			if (logger) {
				logger.info(`Server running in ${ENV} mode on port ${PORT}`);
			}
			else {
				console.log(`Server running in ${ENV} mode on port ${PORT}`);
			}
		});
	})
	.catch((err) => {
		if (logger) {
			logger.error('MongoDB connection error:', err);
		}
		else {
			console.error('MongoDB connection error:', err);
		}
		process.exit(1);
	});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
	if (logger) {
		logger.error('Unhandled Rejection:', reason);
	}
	else {
		console.error('Unhandled Rejection:', reason);
	}
	if (server) server.close(() => process.exit(1));
	else process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
	if (logger) {
		logger.info('SIGTERM received. Shutting down gracefully...');
	}
	else {
		console.log('SIGTERM received. Shutting down gracefully...');
	}
	if (server) {
		server.close(() => {
			if (logger) logger.info('Process terminated!');
			mongoose.connection.close(false, () => {
				if (logger) logger.info('MongoDB connection closed.');
				process.exit(0);
			});
		});
	}
	else {
		process.exit(0);
	}
});
