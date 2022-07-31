import prisma from '../client';

const todoListService = {
  create: (userId: string, name?: string) =>
    prisma.todoList.create({
      include: {
        todos: true,
        users: true,
      },
      data: {
        name,
        users: {
          connect: {
            id: userId,
          },
        },
      },
    }),
  getAllByUserId: (userId: string) =>
    prisma.todoList.findMany({
      include: {
        users: true,
        todos: true,
      },
      where: {
        users: {
          some: {
            id: {
              contains: userId,
            },
          },
        },
      },
    }),
  getById: (id: string) =>
    prisma.todoList.findUniqueOrThrow({
      include: {
        todos: true,
        users: true,
      },
      where: {
        id,
      },
    }),
  update: (id: string, name: string) =>
    prisma.todoList.update({
      include: {
        todos: true,
        users: true,
      },
      where: {
        id: String(id),
      },
      data: {
        name,
      },
    }),
  deleteById: (id: string) =>
    prisma.todoList.delete({
      where: {
        id: String(id),
      },
    }),
};

export default todoListService;
