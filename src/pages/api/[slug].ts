// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../db/client';

export default async function getUrl(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const slug = req.query.slug;

  if (!slug || typeof slug !== 'string') {
    res.status(400).json({
      error: 'Invalid slug',
    });
    return;
  }

  const data = await prisma.url.findFirst({
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  if (!data) {
    res.status(404).json({
      error: 'Slug Not found',
    });
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('cache-control', 's-maxage=10000000, stale-while-revalidate');

  return res.status(200).json(data);
}

