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
  const defaultAnimes: Anime[] = [
    {
      mal_id: 50739,
      title: "Angel Next Door",
      synopsis: "A heartwarming story about the angel next door.",
      images: {
        webp: {
          image_url: "https://cdn.myanimelist.net/images/anime/1240/133638.webp",
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
          image_url: "https://cdn.myanimelist.net/images/anime/5/87048.webp",
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
          image_url: "https://cdn.myanimelist.net/images/anime/1883/144526.webp",
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
          image_url: "https://cdn.myanimelist.net/images/anime/1015/138006.webp",
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
          image_url: "https://cdn.myanimelist.net/images/anime/13/50521.webp",
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
          image_url: "https://cdn.myanimelist.net/images/anime/1826/147276.webp",
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
          image_url: "https://cdn.myanimelist.net/images/anime/6/86733.webp",
        },
      },
      genres: [{ name: "Adventure" }, { name: "Drama" }],
      type: "TV",
      score: 8.7,
      episodes: 13,
      year: 2017,
    },
  ];


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

  return (
    <main className="flex flex-col md:flex-row px-6 max-w-7xl mx-auto gap-6">
      {/* Kiri: Search dan Hasil */}
      <div className="flex-1">
        <div className="relative w-full h-32 my-4 rounded-2xl overflow-hidden">
          <img
            src="https://img.uhdpaper.com/wallpaper/cyberpunk-anime-girl-cat-sci-fi-city-164@3@a"
            alt="Anime Cover"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-white/30 text-center heading-font">
              Fathin's Anime List
            </h1>
          </div>
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
          {(results.length === 0 ? defaultAnimes : results).map((anime) => (
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
      <aside className="w-full md:w-72 md:border-l border-white/20 md:pl-4">

        <div className="flex gap-2 mb-4 my-4 md:block hidden">
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
    </main>
  );
}
