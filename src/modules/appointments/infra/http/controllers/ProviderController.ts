import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderService from '@modules/appointments/services/ListProviderService';

export default class ProviderController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const listProviderService = container.resolve(ListProviderService);

    const providersList = await listProviderService.execute({
      user_id,
    });

    providersList.forEach(eachProvider => {
      delete eachProvider.password;
    });

    return response.status(200).json(providersList);
  }
}
