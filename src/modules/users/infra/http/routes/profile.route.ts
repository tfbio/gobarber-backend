import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';

import ProfileController from '../controllers/ProfileController';

const profileRouter = Router();
profileRouter.use(ensureAuthenticate);

const profileController = new ProfileController();

profileRouter.get('/', profileController.show);
profileRouter.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string(),
      email: Joi.string().email(),
      oldPassword: Joi.string(),
      newPassword: Joi.string(),
      password_confirm: Joi.string().valid(Joi.ref('newPassword')),
    },
  }),
  profileController.update
);

export default profileRouter;
