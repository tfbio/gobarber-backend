import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import Users from '@modules/users/infra/typeorm/entities/Users';
import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';

interface RequestDTO {
  id: string;
  avatarFilename: string;
}

class UpdateUserImageService {
  public async execute({ id, avatarFilename }: RequestDTO): Promise<Users> {
    const repository = getRepository(Users);
    const user = await repository.findOne(id);

    if (!user) {
      throw new AppError('Only for authenticated users.');
    }

    if (user.avatar) {
      const userAvatarPath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarExists = await fs.promises.stat(userAvatarPath);

      if (userAvatarExists) {
        await fs.promises.unlink(userAvatarPath);
      }
    }

    user.avatar = avatarFilename;
    await repository.save(user);

    return user;
  }
}

export default UpdateUserImageService;
