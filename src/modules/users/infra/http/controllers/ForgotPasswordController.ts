import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendForgottenPasswordService from '@modules/users/services/SendForgottenPasswordService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgottenPassword = container.resolve(
      SendForgottenPasswordService
    );

    await sendForgottenPassword.execute({ email });

    return response.status(204).json({});
  }
}
