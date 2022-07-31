import { v4 as uuid } from 'uuid';
import prisma from '../src/client';

export const createUser = (email = `${uuid()}@test.com`) =>
  prisma.user.create({
    data: {
      email,
    },
  });

export const createTodoList = (
  email = `${uuid()}@test.com`,
  name = 'Todos Integration Tests'
) =>
  prisma.todoList.create({
    data: {
      name,
      users: {
        connectOrCreate: {
          create: {
            email,
          },
          where: {
            email,
          },
        },
      },
    },
  });

interface CreateTodoOpts {
  title: string;
  isComplete?: boolean;
}

export const createTodo = (listId: string, todoOpts: CreateTodoOpts) => {
  const { isComplete, title } = todoOpts;
  return prisma.todo.create({
    data: {
      listId,
      isComplete,
      title,
    },
  });
};

export const createTodoListWithTodos = async (
  name = 'Todos Integration Tests'
) => {
  const email = `${uuid()}@test.com`;

  const todoList = await prisma.todoList.create({
    include: {
      todos: true,
      users: true,
    },
    data: {
      name,
      users: {
        connectOrCreate: {
          where: { email },
          create: {
            email,
          },
        },
      },
      todos: {
        connectOrCreate: [
          {
            where: { id: uuid() },
            create: {
              title: 'Extract prisma functions to utils',
            },
          },
          {
            where: { id: uuid() },
            create: {
              title: 'Audit test data creation methods',
            },
          },
        ],
      },
    },
  });

  return todoList;
};
