import { Todo } from '@prisma/client';
import prisma from '../client';

const todoService = {
  getByListId: (listId: string) =>
    prisma.todoList
      .findUniqueOrThrow({
        where: { id: String(listId) },
      })
      .todos(),
  create: (todo: Todo) => {
    const { listId, title } = todo;

    return prisma.todo.create({
      include: {
        todoList: true,
      },
      data: {
        listId,
        title,
      },
    });
  },
  update: (todoId: string, todo: Todo) => {
    const { isComplete, title } = todo;

    return prisma.todo.update({
      where: { id: String(todoId) },
      data: {
        isComplete,
        title,
      },
    });
  },
  deleteById: (todoId: string) =>
    prisma.todo.delete({
      where: { id: String(todoId) },
    }),
};

export default todoService;
