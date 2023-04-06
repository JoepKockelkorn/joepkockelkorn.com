import { V2_MetaFunction, V2_HtmlMetaDescriptor } from '@vercel/remix';
import { partition } from 'remeda';
import { z } from 'zod';

type Matches = Parameters<V2_MetaFunction>[0]['matches'];

const titleMetaSchema = z.object({
  title: z.string(),
});

export function getParentMeta(matches: Matches): {
  parentMetaTitle: string;
  parentMetaOther: V2_HtmlMetaDescriptor[];
} {
  const parentMeta = matches.flatMap((match) => match.meta ?? []);
  const [parentMetaTitles, parentMetaOther] = partition(
    parentMeta,
    (meta) => titleMetaSchema.safeParse(meta).success
  );
  const parentTitle = titleMetaSchema.parse(parentMetaTitles[0]).title;
  return { parentMetaTitle: parentTitle, parentMetaOther };
}
