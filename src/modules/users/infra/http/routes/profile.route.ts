import { Router } from 'express';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
profileRouter.use(ensureAuthenticate);

const profileController = new ProfileController();

profileRouter.get('/', profileController.show);
profileRouter.put('/', profileController.update);

export default profileRouter;
