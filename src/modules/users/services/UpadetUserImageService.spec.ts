import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';

import UpdateUserImageService from './UpdateUserImageService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUserRepository: FakeUserRepository;
let updateUserImgService: UpdateUserImageService;

describe('UpdateUserImage', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUserRepository = new FakeUserRepository();
    updateUserImgService = new UpdateUserImageService(
      fakeUserRepository,
      fakeStorageProvider
    );
  });

  it('should be able to change user profile image', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'John',
      email: 'email@email.com',
      password: '123456',
    });

    await updateUserImgService.execute({
      id: user.id,
      avatarFilename: 'avatar.jpg',
    });

    await updateUserImgService.execute({
      id: user.id,
      avatarFilename: 'newAvatar.jpg',
    });

    expect(deleteFile).toBeCalledWith('avatar.jpg');
    expect(user.avatar).toBe('newAvatar.jpg');
  });

  it('should not be able to change profile image for  unauthenticated users', async () => {
    await expect(
      updateUserImgService.execute({
        id: 'unauthenticatedUserId',
        avatarFilename: 'newAvatar.jpg',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
