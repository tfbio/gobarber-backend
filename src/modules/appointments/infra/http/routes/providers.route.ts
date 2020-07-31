import { Router } from 'express';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import ProviderController from '../controllers/ProviderController';

const providersRouter = Router();

const providerController = new ProviderController();
providersRouter.use(ensureAuthenticate);

providersRouter.get('/', providerController.index);

export default providersRouter;
