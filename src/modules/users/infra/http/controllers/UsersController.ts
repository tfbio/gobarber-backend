import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateUserService from '@modules/users/services/CreateUserService';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, password, email } = request.body;

    const createdUser = container.resolve(CreateUserService);
    const user = await createdUser.execute({ name, password, email });

    delete user.password;
    return response.status(200).json(user);
  }
}
