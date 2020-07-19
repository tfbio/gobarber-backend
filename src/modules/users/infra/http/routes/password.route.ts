import { Router } from 'express';

import SessionsController from '../controllers/ForgotPasswordController';

const passwordRouter = Router();

const forgotPasswordController = new SessionsController();

passwordRouter.post('/forgot', forgotPasswordController.create);

export default passwordRouter;
