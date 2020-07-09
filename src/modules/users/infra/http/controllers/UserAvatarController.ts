import { Request, Response } from 'express';
import { container } from 'tsyringe';

import UpdateUserImageService from '@modules/users/services/UpdateUserImageService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateUserImage = container.resolve(UpdateUserImageService);
    const user = await updateUserImage.execute({
      id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;
    return response.status(200).json(user);
  }
}
