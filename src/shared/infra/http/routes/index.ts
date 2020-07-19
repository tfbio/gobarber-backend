import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.route';
import userRouter from '@modules/users/infra/http/routes/users.route';
import sessionRouter from '@modules/users/infra/http/routes/session.route';
import passwordRouter from '@modules/users/infra/http/routes/password.route';

const routes = Router();

routes.use('/appointment', appointmentsRouter);
routes.use('/user', userRouter);
routes.use('/session', sessionRouter);
routes.use('/password', passwordRouter);

export default routes;
