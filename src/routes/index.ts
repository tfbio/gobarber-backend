import { Router } from 'express';

import appointmentsRouter from './appointments.route';
import userRouter from './users.route';
import sessionRouter from './session.route';

const routes = Router();

routes.use('/appointment', appointmentsRouter);
routes.use('/user', userRouter);
routes.use('/session', sessionRouter);

export default routes;
