import path from 'path';
import fs from 'fs';

import { injectable, inject } from 'tsyringe';

import Users from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import uploadConfig from '@config/upload';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequestDTO {
  id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserImageService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ) {}

  public async execute({ id, avatarFilename }: IRequestDTO): Promise<Users> {
    const user = await this.usersRepository.findById(id);

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
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserImageService;
