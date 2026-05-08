import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog', ({ data }) => !data.entwurf))
    .sort((a, b) => b.data.datum.valueOf() - a.data.datum.valueOf());

  return rss({
    title: 'mathematik-unterrichten.de',
    description: 'Mathe-Didaktik, Aufgaben und diagnostische Fragen für Lehrkräfte',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.datum,
      description: post.data.teaser,
      author: post.data.autor,
      link: `/blog/${post.slug}/`,
    })),
    customData: '<language>de-de</language>',
  });
}
