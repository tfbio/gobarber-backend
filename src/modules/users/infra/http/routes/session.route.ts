import { Router } from 'express';

import AuthenticationService from '@modules/users/services/AuthenticationService';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const usersRepository = new UsersRepository();
  const authentication = new AuthenticationService(usersRepository);

  const { user, token } = await authentication.execute({ email, password });

  delete user.password;
  return response.status(200).json({ user, token });
});

export default sessionRouter;
