const VITE_API_URL = import.meta.env.VITE_API_URL;
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number | null;
}

export default function VideoCard({
  id,
  title,
  thumbnailUrl,
  duration,
}: VideoCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
 const thumbnailId = thumbnailUrl   ? thumbnailUrl
        .replace("thumbnails/", "")
        .replace(".jpg", "") : null;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const handleClick = () => {
    navigate(`/watch/${id}`);
  };

  return (
    <div
      className="relative flex-shrink-0 w-64 cursor-pointer transition-transform duration-300 ease-out"
      style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="relative rounded-md overflow-hidden bg-gray-800">
        {thumbnailUrl ? (
          <img
            src={`${VITE_API_URL}/thumbnails/${thumbnailId}`}
            alt={title}
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="w-full h-36 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">🎬</span>
          </div>
        )}

        {duration && (
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(duration)}
          </span>
        )}

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-3">
            <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
              {title}
            </h3>
            <div className="flex gap-2">
              <button className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1.5 rounded font-medium">
                ▶ Play
              </button>
              <button className="border border-gray-500 hover:border-white text-white text-xs px-3 py-1.5 rounded font-medium">
                ℹ Info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
