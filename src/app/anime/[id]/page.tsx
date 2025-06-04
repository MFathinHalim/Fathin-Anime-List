import React from "react";

async function getAnimeDetails(id: string) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await res.json();
    return data.data;
}

export default async function AnimeDetailPage({ params }: { params: { id: string } }) {
    const anime = await getAnimeDetails(params.id);

    return (
        <main className="relative min-h-screen bg-[#0f0f0f] text-white">
            {/* Background Hero Image */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={anime.images.webp.large_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover blur-sm brightness-50 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-10 left-10">
                    <a className="text-sm text-white/30 hover:text-white/50" href="/">Back to Home</a>

                    <h1 className="mt-3 text-4xl md:text-3xl mb-3 text-white/50 font-bold drop-shadow-lg"><span className="text-white/50">#{anime.rank}</span> {anime.title_english}</h1>
                    <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg w-[90vw]">{anime.title}</h1>
                    <h1 className="text-2xl md:text-2xl my-3 text-white/50 font-bold drop-shadow-lg">{anime.title_japanese}</h1>

                </div>
            </div>

            {/* Content */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid md:grid-cols-3 gap-10">
                {/* Poster */}
                <div className="md:col-span-1 space-y-4">
                    <img
                        src={anime.images.webp.large_image_url}
                        alt={anime.title}
                        className="w-full rounded-xl shadow-lg aspect-[2/3] object-cover"
                    />
                    <div className="bg-white/5 p-6 rounded-xl shadow-md space-y-2 text-sm">
                        <p className="text-gray-300"><span className="font-semibold text-white">Aired:</span> {anime.aired.string} </p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Episodes:</span> {anime.episodes || "?"}</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Broadcast Day:</span> {anime.broadcast.day} </p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Rating:</span> {anime.rating || "?"}</p>

                        <p className="text-gray-300"><span className="font-semibold text-white">Status:</span> {anime.status}</p>
                        <p className="text-gray-300">
                            <span className="font-semibold text-white">Genres:</span>{" "}
                            {anime.genres.map((g: any) => g.name).join(", ")}, {anime.themes.map((g: any) => g.name).join(", ")}
                        </p>
                        <hr />
                        <p className="text-gray-300">
                            <span className="font-semibold text-white">Studios:</span>{" "}
                            {anime.studios?.map((s: any) => s.name).join(", ") || "-"}
                        </p>

                        <p className="text-gray-300"><span className="font-semibold text-white">Score:</span> {anime.score || "-"}</p>
                    </div>


                </div>

                {/* Details */}
                <div className="md:col-span-2 flex flex-col">
                    {anime.trailer?.youtube_id && (
                        <div className="aspect-video mb-6">
                            <iframe
                                className="w-full h-full rounded-xl"
                                src={`https://www.youtube.com/embed/${anime.trailer.youtube_id}`}
                                title="Trailer"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    <p className="mb-4 text-gray-300"><span className="font-semibold text-white">Source:</span> {anime.source}</p>
                    <p className="text-gray-300 mb-3">
                        <span className="font-semibold text-white">Producers:</span>{" "}
                        {anime.producers?.map((p: any) => p.name).join(", ") || "-"}
                    </p>
                    <p className=" text-sm leading-relaxed mb-6 text-justify">{anime.synopsis}</p>
                </div>
            </section>
        </main>
    );
}
