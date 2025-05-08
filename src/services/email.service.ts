// src/services/email.service.ts

/**
 * Placeholder email service for sending emails. Replace with your own implementation.
 */

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
	// Implement actual email sending logic here
	console.log(`[DEV] Sending reset password email to ${email} with token: ${token}`);
};

export const sendVerificationEmail = async (email: string, token: string): Promise<void> => {
	// Implement actual email sending logic here
	console.log(`[DEV] Sending verification email to ${email} with token: ${token}`);
};
