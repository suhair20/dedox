import type { Metadata } from "next";
import CategoryView from "@/components/category/CategoryView";
import { SITE_NAME, SITE_URL } from "@/lib/site";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const name = params.slug.replace(/-/g, " ");
  const title = `${name} perfume collection`;
  const description = `Shop ${name} luxury fragrances at ${SITE_NAME}. Original bottles with fast UAE delivery.`;
  const url = `${SITE_URL}/category/${params.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
    },
  };
}

export default function CategoryPage({ params }: PageProps) {
  return <CategoryView params={params} />;
}
