import { Router } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';

const appointmentsRouter = Router();

appointmentsRouter.use(ensureAuthenticate);
/*
appointmentsRouter.get('/', async (request, response) => {
  const appointmentList = await repository.find();

  return response.status(200).json(appointmentList);
});
*/
appointmentsRouter.post('/', async (request, response) => {
  const { provider_id, date } = request.body;

  const parsedDate = parseISO(date);
  const createAppointmentService = container.resolve(CreateAppointmentService);

  const newAppointment = await createAppointmentService.execute({
    provider_id,
    date: parsedDate,
  });

  return response.status(200).json(newAppointment);
});

export default appointmentsRouter;
