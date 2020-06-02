import { Router } from 'express';

import AuthenticationService from '../services/AuthenticationService';

const sessionRouter = Router();

sessionRouter.post('/', async (request, response) => {
  const { email, password } = request.body;
  const authentication = new AuthenticationService();

  const { user, token } = await authentication.execute({ email, password });

  delete user.password;
  return response.status(200).json({ user, token });
});

export default sessionRouter;
