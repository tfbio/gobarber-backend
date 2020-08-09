import { Router } from 'express';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import ProviderController from '../controllers/ProviderController';
import ProviderMontlyAvailabilityController from '../controllers/ProviderMontlyAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();

const providerController = new ProviderController();
const monthlyAvailabilityController = new ProviderMontlyAvailabilityController();
const dailyAvailabilityController = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthenticate);

providersRouter.get('/', providerController.index);
providersRouter.get(
  '/:provider_id/monthly_availability',
  monthlyAvailabilityController.index
);
providersRouter.get(
  '/:provider_id/daily_availability',
  dailyAvailabilityController.index
);

export default providersRouter;
