import express from 'express';
import { userController } from '../../controllers';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';
import { userValidation } from '../../validations';

const router = express.Router();

router
	.route('/')
	.post(auth('manageUsers'), validate(userValidation.createUser.body), userController.createUser)
	.get(auth('getUsers'), validate(userValidation.getUsers.query), userController.getUsers);

router
	.route('/:userId')
	.get(auth('getUsers'), validate(userValidation.getUser.params), userController.getUser)
	.patch(
		auth('manageUsers'),
		validate(userValidation.updateUser.params),
		validate(userValidation.updateUser.body),
		userController.updateUser
	)
	.delete(auth('manageUsers'), validate(userValidation.deleteUser.params), userController.deleteUser);

export default router;
