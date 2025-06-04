import { Metadata } from "next";
import AnimeDetailPage from "./articlePage";

// 1. Define the async metadata function that fetches article data dynamically based on `params.id`
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params; // Retrieve the `id` from the URL

    // 2. Fetch the data from the API using the `id`
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const dataInfo = await res.json();
    console.log(dataInfo);
    const data = dataInfo.data;

    // 3. Generate dynamic metadata, including the `title`, `description`, and `twitter` image
    return {
        title: data.title,
        description: data.synopsis,
        openGraph: {
            title: data.title,
            description: data.synopsis,
            images: [data.images?.webp?.large_image_url],
            url: `https://fanimelist.vercel.app/anime/${id}`,
        },
        twitter: {
            card: "summary_large_image",
            title: data.title,
            description: data.synopsis,
            images: [data.images?.webp?.large_image_url],
        },
    };
}

// 4. Export the main Page component
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <AnimeDetailPage id={id} />;
}