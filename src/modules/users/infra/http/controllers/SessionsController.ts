import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticationService from '@modules/users/services/AuthenticationService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authentication = container.resolve(AuthenticationService);

    const { user, token } = await authentication.execute({ email, password });

    delete user.password;
    return response.status(200).json({ user, token });
  }
}
