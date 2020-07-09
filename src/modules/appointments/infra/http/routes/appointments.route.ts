import { Router } from 'express';

import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';
import AppointmentController from '../controllers/AppointmentController';

const appointmentsRouter = Router();

const appointmentController = new AppointmentController();
appointmentsRouter.use(ensureAuthenticate);

appointmentsRouter.get('/', appointmentController.index);
appointmentsRouter.post('/', appointmentController.create);

export default appointmentsRouter;
