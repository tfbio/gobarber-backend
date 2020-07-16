import 'reflect-metadata';

import { injectable, inject } from 'tsyringe';

import Users from '@modules/users/infra/typeorm/entities/Users';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/container/providers/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepositories';

interface IRequestDTO {
  id: string;
  avatarFilename: string;
}

@injectable()
class UpdateUserImageService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  public async execute({ id, avatarFilename }: IRequestDTO): Promise<Users> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError('Only for authenticated users.');
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(user.avatar);
    }

    const updatedFilename = await this.storageProvider.saveFile(avatarFilename);

    user.avatar = updatedFilename;
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserImageService;
