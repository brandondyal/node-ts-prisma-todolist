import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { errorHandler, invalidPathHandler } from '@/middleware/error';
import todoController from '@/todos/todoController';
import todoListController from '@/todoLists/todoListController';
import userController from '@/users/userController';
import apiSpec from '@/swagger/spec.json';

const app = express();

app.use(morgan('tiny'));

app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
);

app.use(express.json());
app.use('/todos', todoController);
app.use('/todoLists', todoListController);
app.use('/users', userController);

if (process.env.NODE_ENV === 'dev') {
  app.use('/', swaggerUi.serve, swaggerUi.setup(apiSpec));
}

app.use(errorHandler, invalidPathHandler);

export { app };
