import express from 'express';
import { userSchemas } from '@/request-schemas';
import { validateBody, validateQueryParams } from '@/middleware/validate';
import userService from './userService';

const router = express.Router();

router.get(
  '/',
  validateQueryParams(userSchemas.getByEmail),
  async (req, res, next) => {
    try {
      const { email } = req.query as { email: string };
      const users = await userService.getByEmail(email);

      res.json(users);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  validateBody(userSchemas.createUser),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const newUser = await userService.create(email);

      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/:id',
  validateBody(userSchemas.updateUser),
  async (req, res, next) => {
    const { id } = req.params;
    const { email: newEmail } = req.body;
    try {
      const user = await userService.update(id, newEmail);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
);

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    await userService.deleteById(id);

    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

export default router;
