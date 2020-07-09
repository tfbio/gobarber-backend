import { Router } from 'express';
import { container } from 'tsyringe';

import AuthenticationService from '@modules/users/services/AuthenticationService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;

  const authentication = container.resolve(AuthenticationService);

  const { user, token } = await authentication.execute({ email, password });

  delete user.password;
  return response.status(200).json({ user, token });
});

export default sessionRouter;
