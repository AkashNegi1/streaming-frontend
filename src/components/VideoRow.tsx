import { useRef } from "react";
import VideoCard from "./VideoCard";
import SkeletonLoader from "./SkeletonLoader";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number | null;
}

interface VideoRowProps {
  title: string;
  videos: Video[];
  loading?: boolean;
}

export default function VideoRow({ title, videos, loading = false }: VideoRowProps) {
  
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <h2 className="text-white text-xl font-semibold mb-4 px-4">{title}</h2>
        <SkeletonLoader type="card" />
      </div>
    );
  }

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="py-4 group/row">
      <h2 className="text-white text-4xl font-semibold mb-4 px-4 hover:text-red-200 transition-colors duration-300 cursor-pointer">
        {title}
      </h2>
      
      <div className="relative group">
        <button
          onClick={() => scroll("left")}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          ◀
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto px-4 scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              id={video.id}
              title={video.title}
              thumbnailUrl={video.thumbnailUrl}
              duration={video.duration}
            />
          ))}
        </div>

        <button
          onClick={() => scroll("right")}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-red-600 text-white w-10 h-10 rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
