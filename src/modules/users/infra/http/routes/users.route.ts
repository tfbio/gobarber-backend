import { Router } from 'express';

import multer from 'multer';
import uploadConfig from '@config/upload';

import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserImageService from '@modules/users/services/UpdateUserImageService';
import ensureAuthenticate from '@modules/users/infra/http/middlewares/ensureAuthenticate';

const userRouter = Router();
const upload = multer(uploadConfig);

userRouter.post('/', async (request, response) => {
  const { name, password, email } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({ name, password, email });

  delete user.password;
  return response.status(200).json(user);
});

userRouter.patch(
  '/avatar',
  ensureAuthenticate,
  upload.single('profile'),
  async (request, response) => {
    const updateUserImage = new UpdateUserImageService();
    const user = await updateUserImage.execute({
      id: request.user.id,
      avatarFilename: request.file.filename,
    });

    delete user.password;
    return response.json(user);
  }
);

export default userRouter;
