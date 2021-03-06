import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';

import uploadConfig from '@config/upload';
import { errors } from 'celebrate';
import AppError from '@shared/errors/AppError';

import '@shared/infra/typeorm';
import '@shared/container';

import routes from '@shared/infra/http/routes';
import rateLimiter from './middlewares/rateLimiter';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadConfig.uploads));
app.use(rateLimiter);
app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.status).json({
      status: 'error',
      message: err.message,
    });
  }

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error.',
  });
});

app.listen(3333, () => {
  console.log('server running...');
});
