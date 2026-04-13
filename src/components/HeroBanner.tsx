import { useNavigate } from "react-router-dom";
import SkeletonLoader from "./SkeletonLoader";
import { useEffect, useRef, useState } from "react";
import { FaVolumeMute, FaVolumeUp, FaInfoCircle } from "react-icons/fa";
import Hls from "hls.js";
import api from "../api/client";
const VITE_API_URL = import.meta.env.VITE_API_URL;
interface FeaturedVideo {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  duration: number | null;
  streamUrl: string | null;
}

interface HeroBannerProps {
  video: FeaturedVideo | null;
  loading?: boolean;
}

export default function HeroBanner({ video, loading = false }: HeroBannerProps) {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [previewEnded, setPreviewEnded] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  useEffect(() => {
    if (!video?.id || !videoRef.current) return;

    const videoEl = videoRef.current;

    const loadStream = async () => {
      try {
        const response = await api.get(`/videos/${video.id}/play`);
        const streamPath = response.data.streamUrl;
        const fullUrl = `${VITE_API_URL}${streamPath}`;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls();
      hlsRef.current = hls;
      hls.loadSource(fullUrl);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoEl.muted = true;
        videoEl.play().catch(err => console.error("Autoplay failed:", err));
      });

      hls.on(Hls.Events.LEVEL_LOADED, () => {
        setIsVideoLoaded(true);
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          console.error("HLS error:", data);
        }
      });
    } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
      videoEl.src = fullUrl;
      videoEl.muted = true;
      videoEl.play().catch(err => console.error("Autoplay failed:", err));
    }
      } catch (error) {
        console.error("Failed to load stream:", error);
      }
    };

    loadStream();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [video?.id]);

  useEffect(() => {
    if (!isVideoLoaded) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setPreviewEnded(true);
          setShowInfo(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVideoLoaded]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (previewEnded && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [previewEnded]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  const toggleInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowInfo(!showInfo);
  };

  const handlePlay = () => {
    navigate(`/watch/${video?.id}`);
  };

  const handleVideoClick = () => {
    if (previewEnded) {
      handlePlay();
    }
  };

  if (loading) {
    return <SkeletonLoader type="hero" />;
  }

  if (!video) {
    return (
      <div className="w-full h-[100vh] bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <span className="text-6xl mb-4 block">🎬</span>
          <p className="text-xl">No featured videos yet</p>
          <p className="text-sm mt-2">Upload a video to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[90vh] overflow-hidden">
      {video.thumbnailUrl && (
        <img
          src={video.thumbnailUrl}
          alt={video.title}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            isVideoLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      )}

      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
          isVideoLoaded ? "opacity-100" : "opacity-0"
        }`}
        playsInline
        loop={!previewEnded}
        onClick={handleVideoClick}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 z-10">
        <div
          className={`max-w-2xl transition-all duration-500 ease-out ${
            showInfo || previewEnded
              ? "translate-y-0 opacity-100"
              : "translate-y-8 opacity-0"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {video.title}
          </h1>

          {video.description && (
            <p className="text-gray-300 text-lg mb-6 line-clamp-3">
              {video.description}
            </p>
          )}

          <div className="flex gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlay();
              }}
              className="bg-white text-black hover:bg-gray-200 font-semibold px-8 py-3 rounded-md flex items-center gap-2 transition-colors"
            >
              <span className="text-xl">▶</span>
              Play
            </button>
            <button
              onClick={toggleInfo}
              className="bg-gray-600/80 text-white hover:bg-gray-500/80 font-semibold px-8 py-3 rounded-md flex items-center gap-2 transition-colors"
            >
              <span className="text-xl">
                <FaInfoCircle />
              </span>
              More Info
            </button>
          </div>
        </div>

        {!previewEnded && isVideoLoaded && (
          <div className="mt-4">
            <div className="bg-black/50 inline-flex items-center gap-2 px-4 py-2 rounded-full">
              <span className="text-white font-medium text-sm">
                {countdown}s preview
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="absolute bottom-8 right-8 z-20">
        <button
          onClick={toggleMute}
          className="bg-black/50 hover:bg-black/70 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
        </button>
      </div>

      {previewEnded && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white w-24 h-24 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <span className="text-4xl">▶</span>
          </button>
          <p className="text-white mt-4 text-lg font-medium absolute bottom-32">
            Click to watch full video
          </p>
        </div>
      )}
    </div>
  );
}
