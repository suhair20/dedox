import { redirect } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

/** Old category URLs redirect to the shop collection with the category filter applied. */
export default function CategoryPage({ params }: PageProps) {
  redirect(`/shop?category=${encodeURIComponent(params.slug)}`);
}
