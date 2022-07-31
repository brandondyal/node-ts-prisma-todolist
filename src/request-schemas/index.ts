import Joi from 'joi';

export const todoSchemas = {
  createTodo: Joi.object().keys({
    listId: Joi.string().required(),
    title: Joi.string().required(),
  }),
  getByListId: Joi.object().keys({
    listId: Joi.string().required(),
  }),
  updateTodo: Joi.object()
    .keys({
      isComplete: Joi.boolean().optional(),
      title: Joi.string().optional(),
    })
    .required()
    .min(1)
    .messages({
      'object.min': 'Must provide at least one property to update.',
    }),
};

export const todoListSchemas = {
  createTodoList: Joi.object().keys({
    name: Joi.string().optional(),
    userId: Joi.string().required(),
  }),
  getTodoListByUserId: Joi.object().keys({
    userId: Joi.string().required(),
  }),
  updateTodoList: Joi.object()
    .keys({
      name: Joi.string().optional(),
    })
    .required()
    .min(1)
    .messages({
      'object.min': 'Must provide at least one property to update.',
    }),
};

export const userSchemas = {
  createUser: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
  getByEmail: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
  updateUser: Joi.object()
    .keys({
      email: Joi.string().email().optional(),
    })
    .required()
    .min(1)
    .messages({
      'object.min': 'Must provide at least one property to update.',
    }),
};
