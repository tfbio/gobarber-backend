import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import AppointmentController from '../controllers/AppointmentController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();
appointmentsRouter.use(ensureAuthenticate);

appointmentsRouter.get(
  '/',
  celebrate({
    [Segments.BODY]: {
      provider_id: Joi.string().uuid().required(),
      date: Joi.date().required(),
    },
  }),
  appointmentController.index
);

appointmentsRouter.post('/', appointmentController.create);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
