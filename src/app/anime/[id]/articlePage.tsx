"use client";

import React, { useState, useEffect, useRef } from "react";

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

async function getAnimeReviews(id: string) {
    const res = await fetch(`https://api.jikan.moe/v4/anime/${id}/reviews`);
    const data = await res.json();
    return Array.isArray(data.data) ? data.data : [];
}


const aniListIdQuery = `
query ($malId: Int) {
  Media(idMal: $malId, type: ANIME) {
    id
  }
}
`;

const aniListStreamingQuery = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    streamingEpisodes {
      title
      url
      thumbnail
    }
  }
}
`;

async function fetchAniListIdByMalId(malId: number) {
    const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: aniListIdQuery,
            variables: { malId },
        }),
    });
    const json = await res.json();
    return json.data?.Media?.id || null;
}

async function fetchAniListStreaming(id: number) {
    const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            query: aniListStreamingQuery,
            variables: { id },
        }),
    });
    const json = await res.json();
    return json.data?.Media?.streamingEpisodes || [];
}

function StreamingPlatforms({ streamingPlatforms }: { streamingPlatforms: any[] }) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);
    const scrollSpeed = 5;

    const scrollDirection = useRef(0);

    const scrollStep = () => {
        if (!scrollRef.current) return;
        if (scrollDirection.current === 0) {
            animationFrameId.current = null;
            return;
        }
        scrollRef.current.scrollLeft += scrollDirection.current * scrollSpeed;
        animationFrameId.current = requestAnimationFrame(scrollStep);
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;

        const { left, width } = scrollRef.current.getBoundingClientRect();
        const mouseX = e.clientX - left;
        const threshold = width * 0.3;

        if (mouseX < threshold) scrollDirection.current = -1;
        else if (mouseX > width - threshold) scrollDirection.current = 1;
        else scrollDirection.current = 0;

        if (!animationFrameId.current && scrollDirection.current !== 0) {
            animationFrameId.current = requestAnimationFrame(scrollStep);
        }
    };

    const onMouseLeave = () => {
        scrollDirection.current = 0;
        if (animationFrameId.current) {
            cancelAnimationFrame(animationFrameId.current);
            animationFrameId.current = null;
        }
    };

    return (
        <section id="streaming-platforms" className="max-w-6xl mx-auto px-6 md:px-12 pb-12 gap-10">
            <h2 className="text-3xl font-bold mb-4 text-white">Episodes List</h2>

            {streamingPlatforms.length > 0 ? (
                <div
                    id="streaming-platforms"
                    ref={scrollRef}
                    className="flex gap-6 overflow-x-auto"
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    style={{ userSelect: "none", cursor: "pointer" }}
                >
                    {streamingPlatforms.map((platform, idx) => (
                        <a
                            key={idx}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 pr-20 flex items-center gap-4 p-4 bg-neutral-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 group min-w-[300px]"
                        >
                            {platform.thumbnail ? (
                                <img
                                    draggable={false}
                                    src={platform.thumbnail}
                                    alt={platform.title}
                                    className="h-20 rounded-md object-cover flex-shrink-0"
                                />
                            ) : (
                                <div className="w-16 h-16 rounded-md bg-stone-700 flex items-center justify-center text-gray-400">
                                    N/A
                                </div>
                            )}

                            <div className="flex flex-col">
                                <span className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors duration-300">
                                    {platform.title}
                                </span>
                                <span className="text-sm text-gray-400 group-hover:text-blue-300 transition-colors duration-300 flex items-center gap-1">
                                    Visit Platform{" "}
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4 inline-block"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h6m0 0v6m0-6L10 16" />
                                    </svg>
                                </span>
                            </div>
                        </a>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 italic text-center">No official streaming info available.</p>
            )}
        </section>
    );
}

function SkeletonAnimeDetail() {
    return (
        <main className="relative min-h-screen bg-[#0f0f0f] text-white animate-pulse">
            {/* Hero Skeleton */}
            <div className="relative h-[60vh] w-full overflow-hidden bg-stone-800">
                <div className="absolute bottom-10 left-5 md:left-10 space-y-4">
                    <div className="w-32 h-4 bg-stone-700 rounded" />
                    <div className="w-60 h-6 bg-stone-700 rounded" />
                    <div className="w-24 h-4 bg-stone-700 rounded" />
                </div>
            </div>

            {/* Info Section Skeleton */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid md:grid-cols-3 gap-10">
                <div className="space-y-4">
                    <div className="w-full aspect-[2/3] bg-stone-700 rounded-xl" />
                    <div className="bg-white/5 p-6 rounded-xl space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-3 w-2/3 bg-stone-700 rounded" />
                        ))}
                        <hr />
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-3 w-1/2 bg-stone-700 rounded" />
                        ))}
                    </div>
                </div>

                <div className="md:col-span-2 flex flex-col space-y-4">
                    <div className="w-full aspect-video bg-stone-700 rounded-xl" />
                    <div className="h-4 w-1/2 bg-stone-700 rounded" />
                    <div className="h-4 w-1/3 bg-stone-700 rounded" />
                    <div className="h-3 w-full bg-stone-700 rounded" />
                    <div className="h-3 w-3/4 bg-stone-700 rounded" />
                    <div className="h-4 w-40 bg-stone-700 rounded" />
                </div>
            </section>

            {/* Streaming Skeleton */}
            <section className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
                <div className="h-6 w-40 bg-stone-700 rounded mb-4" />
                <div className="flex gap-6 overflow-x-auto">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="min-w-[300px] bg-neutral-800 rounded-lg p-4 flex gap-4">
                            <div className="w-20 h-20 bg-stone-600 rounded-md" />
                            <div className="flex flex-col justify-center space-y-2">
                                <div className="w-32 h-4 bg-stone-600 rounded" />
                                <div className="w-24 h-3 bg-stone-500 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}


export default function AnimeDetailPage({ id }: any) {

    const [anime, setAnime] = useState<any>(null);
    const [characters, setCharacters] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [charShowMore, setCharShowMore] = useState(false);
    const [staffShowMore, setStaffShowMore] = useState(false);
    const [streamingPlatforms, setStreamingPlatforms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState<any[]>([]);

    const [selectedTag, setSelectedTag] = useState("All");
    const filteredReviews = selectedTag === "All"
        ? reviews
        : reviews.filter((r) =>
            r.tags?.some((tag: string) => tag.toLowerCase() === selectedTag.toLowerCase())
        );
    useEffect(() => {
        async function fetchData() {
            setLoading(true);

            const animeDetail = await getAnimeDetails(id);
            const animeChars = await getAnimeCharacters(id);
            const animeStaff = await getAnimeStaff(id);
            const animeReviews = await getAnimeReviews(id);

            setReviews(animeReviews);
            setAnime(animeDetail);
            setCharacters(animeChars);
            setStaff(animeStaff);

            if (animeDetail?.mal_id) {
                const aniListId = await fetchAniListIdByMalId(animeDetail.mal_id);
                if (aniListId) {
                    const streaming = await fetchAniListStreaming(aniListId);
                    setStreamingPlatforms(streaming);
                } else {
                    setStreamingPlatforms([]);
                }
            } else {
                setStreamingPlatforms([]);
            }

            setLoading(false);
        }

        fetchData();
    }, [id]);

    if (loading || !anime) return <SkeletonAnimeDetail />;

    return (
        <>
            <main className="relative min-h-screen bg-[#0f0f0f] text-white">
                {/* Hero */}
                <div className="relative h-[60vh] w-full overflow-hidden">
                    <img
                        src={anime.images?.webp?.large_image_url}
                        alt={anime.title || "Anime Image"}
                        className="w-full h-full object-cover blur-sm brightness-50 scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    <div className="absolute bottom-10 left-5 md:left-10">
                        <a className="text-sm text-white/30 hover:text-white/50" href="/">
                            Back to Home
                        </a>
                        <h1 className="text-4xl md:text-3xl my-3 text-white/50 font-bold drop-shadow-lg">
                            {anime.title_english || anime.title}
                        </h1>
                        <h1 className="text-4xl md:text-5xl font-bold drop-shadow-lg w-[90vw]">{anime.title}</h1>
                        <h1 className="text-2xl md:text-2xl my-3 text-white/50 font-bold drop-shadow-lg">
                            {anime.title_japanese || ""}
                        </h1>
                    </div>
                </div>

                {/* Info Section */}
                <section className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid md:grid-cols-3 gap-10">
                    {/* Sidebar */}
                    <div className="md:col-span-1 space-y-4">
                        <img
                            src={anime.images?.webp?.large_image_url}
                            alt={anime.title}
                            className="w-full rounded-xl shadow-lg aspect-[2/3] object-cover"
                        />

                        <div className="bg-white/5 p-6 rounded-xl shadow-md space-y-4 text-sm">
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Status:</span> {anime.status || "-"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Aired:</span> {anime.aired?.string || "-"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Episodes:</span> {anime.episodes || "?"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Durations:</span> {anime.duration || "-"}
                            </p>
                            <hr />

                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Broadcast Day:</span> {anime.broadcast?.day || "-"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Rating:</span> {anime.rating || "?"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Genres:</span>{" "}
                                {[...(anime.genres || []), ...(anime.themes || [])].map((g: any) => g.name).join(", ")}
                            </p>
                            <hr />
                            <p className="text-gray-300"><span className="font-semibold text-white">Synonim:</span> {anime.synonim || "-"}</p>
                            <p className="text-gray-300 mb-3">
                                <span className="font-semibold text-white">Source:</span> {anime.source || "-"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Studios:</span>{" "}
                                {anime.studios?.map((s: any) => s.name).join(", ") || "-"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Licensors:</span>{" "}
                                {anime.licensors?.map((s: any) => s.name).join(", ") || "-"}
                            </p>
                            <p className="text-gray-300">
                                <span className="font-semibold text-white">Score:</span> {anime.score || "-"} by {anime.scored_by ? anime.scored_by.toLocaleString("id-ID") : "?"} users
                            </p>
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
                                />
                            </div>
                        )}
                        <p className="text-lg leading-relaxed mb-3 text-justify"><span className="font-semibold text-white">Rank:</span> #{anime.rank || ""} <span className="font-semibold text-white">Popularity:</span> #{anime.popularity || ""} <span className="font-semibold text-white">Members:</span> {anime.members.toLocaleString("id-ID") || ""} </p>
                        <p className="text-lg leading-relaxed mb-3 text-justify"><span className="font-semibold text-white">Favorites:</span> {anime.favorites.toLocaleString("id-ID") || ""}</p>
                        <p className="text-sm leading-relaxed mb-6 text-justify">{anime.background || ""}</p>
                        <p className="text-white font-bold text-lg mb-3">Synopsis</p>
                        <p className="text-sm leading-relaxed mb-6 text-justify">{anime.synopsis || "-"}</p>
                        <p className="text-gray-300 mb-3">
                            <span className="font-semibold text-white">Producers:</span>{" "}
                            {anime.producers?.map((p: any) => p.name).join(", ") || "-"}
                        </p>
                        <a href={anime.url} className="text-gray-300 mb-3">
                            <span className="font-semibold text-white">Check on My Anime List</span>
                        </a>

                    </div>
                </section>

                {/* Streaming platforms */}
                <StreamingPlatforms streamingPlatforms={streamingPlatforms} />

                {/* Characters */}
                <section className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
                    <h2 className="text-2xl font-bold mb-4">Characters & Voice Actors</h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {(charShowMore ? characters : characters.slice(0, 10)).map((char: any) => (
                            <div
                                key={char?.character?.mal_id}
                                className="flex gap-4 bg-white/5 p-4 rounded-lg items-center"
                            >
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
                            onClick={() => setCharShowMore((prev) => !prev)}
                        >
                            {charShowMore ? "Show Less" : "Show More"}
                        </button>
                    )}

                    {/* Staff */}
                    <h2 className="text-2xl font-bold mt-12 mb-4">Staff</h2>
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                        {(staffShowMore ? staff : staff.slice(0, 10)).map((person: any) => (
                            <div
                                key={person.person.mal_id}
                                className="bg-white/5 p-4 rounded-lg flex items-center gap-4"
                            >
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
                            onClick={() => setStaffShowMore((prev) => !prev)}
                        >
                            {staffShowMore ? "Show Less" : "Show More"}
                        </button>
                    )}
                </section>

                {/* Reviews */}
                <section className="max-w-6xl mx-auto px-6 md:px-12 pb-12">
                    <div className="flex justify-between items-center">

                        <h2 className="text-2xl font-bold mb-4">User Reviews</h2>
                        <div className="mb-4">
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="bg-white/10 cursor-pointer rounded-full text-white px-3 py-2 outline-none"
                            >
                                <option className="bg-neutral-800 cursor-pointer text-white" value="All">All</option>
                                <option className="bg-neutral-800 cursor-pointer text-white" value="Recommended">Recommended</option>
                                <option className="bg-neutral-800 cursor-pointer text-white" value="Mixed Feelings">Mixed Feelings</option>
                                <option className="bg-neutral-800 cursor-pointer text-white" value="Not Recommended">Not Recommended</option>
                            </select>

                        </div>
                    </div>
                    {reviews.length > 0 ? (
                        <div className="space-y-6">
                            {filteredReviews.slice(0, 5).map((review) => (
                                <div key={review.mal_id} className="bg-white/5 p-4 rounded-lg">
                                    <div className="flex gap-4 mb-4">

                                        {review.user.images?.jpg?.image_url && (
                                            <img
                                                src={review.user.images.jpg.image_url}
                                                alt={review.user.name}
                                                className="w-13 h-13 object-cover rounded-full"
                                            />
                                        )}
                                        <div>
                                            <p className="text-white font-semibold"> {review.user?.username || "Anonymous"} </p>
                                            <div className="flex flex-wrap gap-2 pt-1">
                                                {review.tags?.map((tag: string, index: number) => (
                                                    <span
                                                        key={index}
                                                        className="bg-white/10 text-white/70 text-xs px-2 py-1 rounded"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    {review.reactions && (
                                        <div className="my-2 text-xs text-gray-400 flex flex-wrap gap-3">
                                            {Object.entries(review.reactions as Record<string, number>).map(([key, value]) => {
                                                if (value > 0) {
                                                    return (
                                                        <span key={key} className="bg-white/10 px-2 py-1 rounded">
                                                            {key.replace(/_/g, " ")}: {value}
                                                        </span>
                                                    );
                                                }
                                                return null;
                                            })}
                                        </div>
                                    )}
                                    <p className="text-sm text-white/60 mb-2">Type: {review.type} Score: {review.score}</p>
                                    <p className="text-sm text-white/80 text-justify">{review.review.slice(0, 500)}... <a
                                        href={review.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 text-sm hover:underline"
                                    >
                                        Read full review
                                    </a></p>
                                </div>
                            ))}
                            <a href={anime.url} className="text-gray-300 mb-3">
                                <span className="font-semibold text-white">Check other reviews</span>
                            </a>
                        </div>
                    ) : (
                        <p className="text-gray-400 italic text-center">No reviews available.</p>
                    )}
                </section>

            </main>
        </>
    );
}
