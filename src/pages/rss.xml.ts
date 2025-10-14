import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";

export async function GET(context: APIContext) {
  const posts = await getCollection("blogs");
  const cards = await getCollection("cards");
  const slides = await getCollection("slides");
  const contents = [...posts, ...cards, ...slides];
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items: contents.map((content) => ({
      ...content.data,
      link: `/${content.collection}/${content.id}`,
    })),
  });
}
