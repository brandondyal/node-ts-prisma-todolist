import express from 'express';
import todoService from './todoService';
import { todoSchemas } from '../request-schemas';
import { validateBody, validateQueryParams } from '../middleware/validate';

const router = express.Router();

router.get(
  '/',
  validateQueryParams(todoSchemas.getByListId),
  async (req, res, next) => {
    try {
      const { listId } = req.query as { listId: string };
      const todos = await todoService.getByListId(listId);

      res.json(todos);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validateBody(todoSchemas.createTodo),
  async (req, res, next) => {
    try {
      const newTodo = await todoService.create(req.body);

      res.status(201).json(newTodo);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateBody(todoSchemas.updateTodo),
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const updatedTodo = await todoService.update(id, req.body);

      res.json(updatedTodo);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await todoService.deleteById(id);

    res.status(204).json();
  } catch (error) {
    next(error);
  }
});

export default router;
