import * as trpc from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { z } from 'zod';
import { prisma } from '../../../db/client';

export const appRouter = trpc
  .router()
  .query('isSlug', {
    input: z.object({ slug: z.string() }),
    async resolve({ input }) {
      const data = await prisma.url.count({
        where: {
          slug: input.slug,
        },
      });
      return { found: data > 0 };
    },
  })
  .mutation('createUrl', {
    input: z.object({
      url: z.string(),
      slug: z.string(),
    }),
    async resolve({ input }) {
      console.log('createUrl', input);
      try {
        await prisma.url.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        });
      } catch (e) {
        console.log(e);
      }
    },
  });

// export type definition of API
export type AppRouter = typeof appRouter;

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
});

