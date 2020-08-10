import { Router } from 'express';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import AppointmentController from '../controllers/AppointmentController';
import ProviderAppointmentsController from '../controllers/ProviderAppointmentsController';

const appointmentsRouter = Router();

const appointmentController = new AppointmentController();
const providerAppointmentsController = new ProviderAppointmentsController();
appointmentsRouter.use(ensureAuthenticate);

appointmentsRouter.get('/', appointmentController.index);

appointmentsRouter.post('/', appointmentController.create);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
