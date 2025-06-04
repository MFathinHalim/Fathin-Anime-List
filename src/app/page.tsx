"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Anime = {
  mal_id: number;
  title: string;
  synopsis: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  genres: {
    name: string;
  }[];
  type: string;
  score: number;
  episodes: number;
  year: number;
};

export default function Home() {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [topAiring, setTopAiring] = useState<Anime[]>([]);
  const [featuredAnime, setFeaturedAnime] = useState<any>(null);

  const defaultAnimes: Anime[] = [
    {
      mal_id: 50739,
      title: "Angel Next Door",
      synopsis: "A heartwarming story about the angel next door.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1240/133638l.webp",
        },
      },
      genres: [{ name: "Romance" }],
      type: "TV",
      score: 8.5,
      episodes: 12,
      year: 2023,
    },
    {
      mal_id: 32281,
      title: "Kimi No Nawa",
      synopsis: "Two strangers find themselves mysteriously linked.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/5/87048l.webp",
        },
      },
      genres: [{ name: "Drama" }],
      type: "Movie",
      score: 9.0,
      episodes: 1,
      year: 2016,
    },
    {
      mal_id: 59419,
      title: "Project Sekai Movie: Kowareta Sekai to Utaenai Miku",
      synopsis: "Rhythm game starring Hatsune Miku and friends.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1883/144526l.webp",
        },
      },
      genres: [{ name: "Music" }],
      type: "Game",
      score: 7.8,
      episodes: 0,
      year: 2020,
    },
    {
      mal_id: 52991,
      title: "Frieren Beyond End Journey",
      synopsis: "An emotional fantasy adventure.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1015/138006l.webp",
        },
      },
      genres: [{ name: "Fantasy" }],
      type: "TV",
      score: 8.2,
      episodes: 12,
      year: 2023,
    },
    {
      mal_id: 12189,
      title: "Hyouka",
      synopsis: "A mystery solving high school story.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/13/50521l.webp",
        },
      },
      genres: [{ name: "Mystery" }],
      type: "TV",
      score: 8.3,
      episodes: 22,
      year: 2012,
    },
    {
      mal_id: 28999,
      title: "Charlotte",
      synopsis: "Supernatural powers disrupt the lives of teens.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1826/147276l.webp",
        },
      },
      genres: [{ name: "Supernatural" }],
      type: "TV",
      score: 7.9,
      episodes: 13,
      year: 2015,
    },
    {
      mal_id: 46095,
      title: "Vivy: Fluorite Eye's Song",
      synopsis: "An AI songstress fights to save the future through music and combat.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1551/128960l.webp",
        },
      },
      genres: [{ name: "Sci-Fi" }, { name: "Action" }],
      type: "TV",
      score: 8.5,
      episodes: 13,
      year: 2021,
    },
    {
      mal_id: 34599,
      title: "Made in Abyss",
      synopsis: "A young girl and her robot friend descend into a mysterious abyss.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/6/86733l.webp",
        },
      },
      genres: [{ name: "Adventure" }, { name: "Drama" }],
      type: "TV",
      score: 8.7,
      episodes: 13,
      year: 2017,
    },
  ];

  useEffect(() => {
    const fetchFeaturedAnime = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/anime?order_by=score&sort=desc");
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.data.length);
          setFeaturedAnime(data.data[randomIndex]);
        }
      } catch (err) {
        console.error("Failed to fetch featured anime", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedAnime();
  }, []);
  const searchAnime = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      const uniqueResults: any = Array.from(
        new Map(data.data.map((item: Anime) => [`${item.mal_id}-${item.title}`, item]))
      ).map(([_, val]) => val);

      setResults(uniqueResults);
    } catch (err) {
      console.error("Error fetching anime:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Top Airing Anime
  useEffect(() => {
    const fetchTopAiring = async () => {
      try {
        const res = await fetch("https://api.jikan.moe/v4/top/anime?filter=airing");
        const data = await res.json();
        const uniqueResults: any = Array.from(
          new Map(data.data.map((item: Anime) => [`${item.mal_id}-${item.title}`, item]))
        ).map(([_, val]) => val);
        setTopAiring(uniqueResults.slice(0, 8)); // Top 10
      } catch (err) {
        console.error("Error fetching top airing anime:", err);
      }
    };

    fetchTopAiring();
  }, []);
  useEffect(() => {
    if (results.length > 0) {
      setFeaturedAnime(results[0]);

    }
  }, [results]);


  return (
    <main className="flex flex-col md:flex-row px-6 max-w-7xl mx-auto gap-6">
      {/* Kiri: Search dan Hasil */}
      <div className="flex-1">
        <div className="relative w-full overflow-hidden bg-black/30 mb-5">

          {featuredAnime?.images?.webp?.large_image_url && (
            <div>
              {/* Gambar Background (blur dan gelap) */}
              <img
                src={featuredAnime.images.webp.image_url}
                alt={featuredAnime.title}
                className="absolute inset-0 w-full h-20 object-cover blur-sm brightness-50 scale-105"
              />

              {/* Overlay Teks di Atas Gambar */}
              <div className="relative z-10 py-5 text-white text-center">
                <h1 className="text-2xl text-center lg:mb-4 font-bold">Fathin's Anime List</h1>
              </div>
            </div>
          )}

          {/* Optional: Tambahkan lapisan gelap kalau ingin lebih kontras */}
          <div className="absolute inset-0 bg-black/80"></div>

          {featuredAnime?.images?.webp?.large_image_url ? (
            <>
              <Link href={`/anime/${featuredAnime.mal_id}`} key={`${featuredAnime.mal_id}-${featuredAnime.title}`}>

                <div className="relative hidden lg:block w-full h-auto rounded-2xl hover:bg-gray-800/40">
                  {featuredAnime && (
                    <>
                      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 p-4">
                        {/* Gambar Kiri */}
                        <img
                          src={featuredAnime.images.webp.large_image_url}
                          alt={featuredAnime.title}
                          className="w-full md:w-1/4 aspect-[2/3] rounded-lg object-cover shadow-lg"
                        />

                        {/* Info Kanan */}
                        <div className="flex-1 text-white text-center md:text-left">
                          <h1 className="mt-2 text-3xl md:text-4xl font-bold drop-shadow-lg">
                            <span className="text-orange-300">#{featuredAnime.rank}</span>
                          </h1>
                          <h1 className="text-xl md:text-xl mb-3 text-white/50 font-bold drop-shadow-lg"> {featuredAnime.title_english}</h1>
                          <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">{featuredAnime.title}</h1>
                          <h1 className="text-xl md:text-xl my-3 text-white/50 font-bold drop-shadow-lg">{featuredAnime.title_japanese}</h1>

                          <p className="text-md md:text-sm mb-3 text-white/90 max-w-2xl line-clamp-3">
                            {featuredAnime.synopsis}
                          </p>
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start text-sm">
                            <p className="text-gray-300">
                              <span className="font-semibold text-white">Genres:</span>{" "}
                              {featuredAnime.genres.map((g: any) => g.name).join(", ")}, {featuredAnime.themes.map((g: any) => g.name).join(", ")}
                            </p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Aired:</span> {featuredAnime.aired.string} </p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Status:</span> {featuredAnime.status}</p>
                            <p className="text-gray-300"><span className="font-semibold text-white">Score:</span> {featuredAnime.score || "-"}</p>

                            <hr />
                            <p className="text-gray-300">
                              <span className="font-semibold text-white">Studios:</span>{" "}
                              {featuredAnime.studios?.map((s: any) => s.name).join(", ") || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                </div>
              </Link>
            </>
          ) : (
            <div className="flex justify-center items-center w-full h-full text-white text-lg mt-6">Loading featured anime...</div>
          )}
        </div>
        <div className="flex gap-2 mb-4 my-4 md:hidden ">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchAnime();
            }} placeholder="Search anime..."
            className="border p-2 px-4 border-white/30 rounded-full w-full"
          />
        </div>
        {loading && <p className="text-center">Searching...</p>}

        <div className="grid grid-cols-2 md:grid-cols-4 ">
          {(results.length === 0 ? defaultAnimes : results.slice(1)).map((anime) => (
            <Link href={`/anime/${anime.mal_id}`} key={`${anime.mal_id}-${anime.title}`}>
              <div className="w-full h-full hover:bg-gray-400/50 p-2 mb-5 transition cursor-pointer flex flex-col">
                <img
                  src={anime.images.webp.image_url}
                  alt={anime.title}
                  className="w-full aspect-[2/3] object-cover rounded"
                />
                <div className="mt-3 flex flex-col flex-grow">
                  <h2 className="text-md font-semibold line-clamp-2">{anime.title}</h2>
                  <p className="text-xs text-white/50 mt-1">
                    <strong>Type:</strong> {anime.type} | <strong>Score:</strong> {anime.score || "-"}<br />
                    <strong>Episodes:</strong> {anime.episodes || "?"} | <strong>Year:</strong> {anime.year || "-"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Kanan: Sidebar Top Airing */}
      <aside className="w-full md:w-72 md:border-l border-white/20 md:pl-4 max-h-[100vh] sticky top-0 overflow-y-auto">

        <div className="flex gap-2 md:block sticky top-0 bg-black py-4  hidden ">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") searchAnime();
            }} placeholder="Search anime..."
            className="border p-2 px-4 border-white/30 rounded-full w-full"
          />
        </div>
        <h2 className="text-xl font-bold mb-4">Top Airing Anime</h2>
        <div className="flex flex-col gap-4">
          {topAiring.map((anime) => (
            <Link href={`/anime/${anime.mal_id}`} key={`${anime.mal_id}-${anime.title}`}>
              <div className="flex gap-3 cursor-pointer hover:bg-gray-100/30 p-2 rounded transition">
                <img
                  src={anime.images.webp.image_url}
                  alt={anime.title}
                  className="w-16 h-24 object-cover rounded"
                />
                <div className="flex flex-col">
                  <h3 className="text-sm font-semibold line-clamp-2">{anime.title}</h3>
                  <p className="text-xs text-white/60">
                    {anime.type} | {anime.episodes || "?"} eps<br />
                    Score: {anime.score || "-"}
                  </p>
                  <p className="text-xs text-white/40 italic">
                    {anime.genres?.map((g) => g.name).slice(0, 2).join(", ") || "-"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </aside>
    </main >
  );
}
