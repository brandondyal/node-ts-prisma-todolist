import prisma from '../client';

const userService = {
  create: (email: string) =>
    prisma.user.create({
      data: {
        email,
      },
    }),
  getByEmail: (email: string) =>
    prisma.user.findUniqueOrThrow({
      where: { email: String(email) },
    }),
  update: (userId: string, newEmail: string) =>
    prisma.user.update({
      where: { id: String(userId) },
      data: {
        email: newEmail,
      },
    }),
  deleteById: (userId: string) =>
    prisma.user.delete({
      where: { id: String(userId) },
    }),
};

export default userService;
