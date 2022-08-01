import express from 'express';
import { validateBody, validateQueryParams } from '@/middleware/validate';
import { todoListSchemas } from '@/request-schemas';
import todoListService from './todoListService';

const router = express.Router();

router.get(
  '/',
  validateQueryParams(todoListSchemas.getTodoListByUserId),
  async (req, res, next) => {
    try {
      const { userId } = req.query as { userId: string };
      const todoLists = await todoListService.getAllByUserId(userId);

      res.status(200).json(todoLists);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validateBody(todoListSchemas.createTodoList),
  async (req, res, next) => {
    try {
      const { name, userId } = req.body;
      const newTodoList = await todoListService.create(userId, name);

      res.status(201).json(newTodoList);
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const todoList = await todoListService.getById(id);

    res.status(200).json(todoList);
  } catch (error) {
    next(error);
  }
});

router.put(
  '/:id',
  validateBody(todoListSchemas.updateTodoList),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const updatedTodoList = await todoListService.update(id, name);

      res.status(200).json(updatedTodoList);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await todoListService.deleteById(id);

    res.status(204).json({});
  } catch (error) {
    next(error);
  }
});

export default router;
