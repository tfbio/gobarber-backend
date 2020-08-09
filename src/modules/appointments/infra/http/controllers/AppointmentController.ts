import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

export default class AppointmentController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { provider_id, date } = request.body;
    const user_id = request.user.id;

    const parsedDate = parseISO(date);
    const createAppointmentService = container.resolve(
      CreateAppointmentService
    );

    const newAppointment = await createAppointmentService.execute({
      provider_id,
      user_id,
      date: parsedDate,
    });

    return response.status(200).json(newAppointment);
  }

  public async index(request: Request, response: Response): Promise<Response> {
    const userRepository = new AppointmentsRepository();
    const appointmentList = await userRepository.findAll();

    return response.status(200).json(appointmentList);
  }
}
