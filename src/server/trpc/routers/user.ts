import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { publicProcedure } from '../api/procedure';
import { createTRPCRouter } from '../api/trpc';

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const checkExist = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (checkExist) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already exist',
        });
      }

      const createUser = await ctx.db.user.create({ data: input });
      return createUser;
    }),
  getUserList: publicProcedure.query(async ({ ctx }) => {
    const userList = await ctx.db.user.findMany();
    return userList;
  }),
});
