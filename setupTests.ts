import dotenv from 'dotenv';
import prisma from './src/client';

dotenv.config({ path: '.env.test' });

afterEach(async () => {
  const deleteTodos = prisma.todo.deleteMany();
  const deleteUsers = prisma.user.deleteMany();
  const deleteTodoLists = prisma.todoList.deleteMany();

  await prisma.$transaction([deleteTodos, deleteUsers, deleteTodoLists]);
  await prisma.$disconnect();
});
