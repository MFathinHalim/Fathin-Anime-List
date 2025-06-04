"use client";

import React, { useState, useEffect } from "react";

async function getAnimeDetails(id: string) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}`);
    const data = await res.json();
    return data.data;
}

async function getAnimeCharacters(id: string) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
}

async function getAnimeStaff(id: string) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/staff`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
}

type Props = {
    params: {
        id: string;
    };
};

export default function AnimeDetailPage({ params }: any) {
    const { id }: any = React.use(params); // unwrap if params is a Promise
    const [anime, setAnime] = useState<any>(null);

    const [characters, setCharacters] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [charShowMore, setCharShowMore] = useState(false);
    const [staffShowMore, setStaffShowMore] = useState(false);

    useEffect(() => {
        async function fetchData() {
            const a = await getAnimeDetails(id);
            const c = await getAnimeCharacters(id);
            const s = await getAnimeStaff(id);

            setAnime(a);
            setCharacters(c);
            setStaff(s);
        }
        fetchData();
    }, [id]);

    if (!anime) return <div className="text-white p-6">Loading...</div>;

    return (
        <main className="relative min-h-screen bg-[#0f0f0f] text-white">
            {/* Hero */}
            <div className="relative h-[60vh] w-full overflow-hidden">
                <img
                    src={anime.images.webp.large_image_url}
                    alt={anime.title}
                    className="w-full h-full object-cover blur-sm brightness-50 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute bottom-10 left-10">
                    <a className="text-sm text-white/30 hover:text-white/50" href="/">Back to Home</a>
                    <h1 className="mt-3 text-4xl md:text-3xl mb-3 text-white/50 font-bold drop-shadow-lg">
                        <span className="text-white/50">#{anime.rank}</span> {anime.title_english}
                    </h1>
                    <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg w-[90vw]">{anime.title}</h1>
                    <h1 className="text-2xl md:text-2xl my-3 text-white/50 font-bold drop-shadow-lg">{anime.title_japanese}</h1>
                </div>
            </div>

            {/* Info Section */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid md:grid-cols-3 gap-10">
                {/* Sidebar */}
                <div className="md:col-span-1 space-y-4">
                    <img
                        src={anime.images.webp.large_image_url}
                        alt={anime.title}
                        className="w-full rounded-xl shadow-lg aspect-[2/3] object-cover"
                    />
                    <div className="bg-white/5 p-6 rounded-xl shadow-md space-y-2 text-sm">
                        <p className="text-gray-300"><span className="font-semibold text-white">Aired:</span> {anime.aired.string}</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Episodes:</span> {anime.episodes || "?"}</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Broadcast Day:</span> {anime.broadcast?.day || "-"}</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Rating:</span> {anime.rating || "?"}</p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Status:</span> {anime.status}</p>
                        <p className="text-gray-300">
                            <span className="font-semibold text-white">Genres:</span>{" "}
                            {[...(anime.genres || []), ...(anime.themes || [])].map((g: any) => g.name).join(", ")}
                        </p>
                        <hr />
                        <p className="text-gray-300">
                            <span className="font-semibold text-white">Studios:</span>{" "}
                            {anime.studios?.map((s: any) => s.name).join(", ") || "-"}
                        </p>
                        <p className="text-gray-300"><span className="font-semibold text-white">Score:</span> {anime.score || "-"}</p>
                    </div>
                </div>

                {/* Main Content */}
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
                    <p className="text-sm leading-relaxed mb-6 text-justify">{anime.synopsis}</p>
                </div>
            </section>

            {/* CHARACTERS */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
                <h2 className="text-2xl font-bold mb-4">Characters & Voice Actors</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {(charShowMore ? characters : characters.slice(0, 10)).map((char: any) => (
                        <div key={char?.character?.mal_id} className="flex gap-4 bg-white/5 p-4 rounded-lg items-center">
                            {char?.character?.images?.webp?.image_url && (
                                <img
                                    src={char.character.images.webp.image_url}
                                    alt={char.character.name}
                                    className="w-20 h-28 object-cover rounded"
                                />
                            )}
                            <div className="flex-1 flex flex-col md:flex-row justify-between">
                                <div>
                                    <h3 className="font-semibold">{char?.character?.name || "Unknown"}</h3>
                                    <p className="text-sm text-white/50">{char?.role || "Unknown Role"}</p>
                                </div>
                                {char?.voice_actors?.[0] && (
                                    <div className="text-right">
                                        <h3 className="font-semibold">{char.voice_actors[0]?.person?.name}</h3>
                                        <p className="text-sm text-white/50">{char?.voice_actors[0]?.language || ""}</p>
                                    </div>
                                )}
                            </div>
                            {char?.voice_actors?.[0]?.person?.images?.jpg?.image_url && (
                                <img
                                    src={char.voice_actors[0].person.images.jpg.image_url}
                                    alt={char.voice_actors[0].person.name}
                                    className="w-20 h-28 object-cover rounded"
                                />
                            )}
                        </div>
                    ))}
                </div>
                {characters.length > 10 && (
                    <button
                        className="text-sm text-blue-400 hover:underline"
                        onClick={() => setCharShowMore(prev => !prev)}
                    >
                        {charShowMore ? "Show Less" : "Show More"}
                    </button>
                )}

                {/* STAFF */}
                <h2 className="text-2xl font-bold mt-12 mb-4">Staff</h2>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {(staffShowMore ? staff : staff.slice(0, 10)).map((person: any) => (
                        <div key={person.person.mal_id} className="bg-white/5 p-4 rounded-lg flex items-center gap-4">
                            {person.person.images?.jpg?.image_url && (
                                <img
                                    src={person.person.images.jpg.image_url}
                                    alt={person.person.name}
                                    className="w-16 h-16 object-cover rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold">{person.person.name}</h3>
                                <p className="text-sm text-white/50">{person.positions.join(", ")}</p>
                            </div>
                        </div>
                    ))}
                </div>
                {staff.length > 10 && (
                    <button
                        className="text-sm text-blue-400 hover:underline"
                        onClick={() => setStaffShowMore(prev => !prev)}
                    >
                        {staffShowMore ? "Show Less" : "Show More"}
                    </button>
                )}
            </section>
        </main>
    );
}
