import { useEffect, useRef, useState, useCallback } from "react";
import Hls from "hls.js";
import type { Level } from "hls.js";
import { getVideoProgress, saveVideoProgress } from "../api/videos";
import SkipIndicator from "./SkipIndicator";
import ResumePrompt from "./ResumePrompt";
import VideoControls from "./VideoControls";

const VIDEO_CONFIG = {
  SKIP_SECONDS: 10,
  PROGRESS_SAVE_INTERVAL: 10000,
  CONTROLS_TIMEOUT: 3000,
  HIDE_CONTROLS_DELAY: 250,
  CLICK_TIMEOUT: 250,
  RESUME_THRESHOLD: 10,
} as const;

interface VideoPlayerProps {
  src: string;
  videoId?: string;
}

export default function VideoPlayer({ src, videoId }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [levels, setLevels] = useState<Level[]>([]);
  const [currentLevel, setCurrentLevel] = useState(-1);
  const [qualityLabel, setQualityLabel] = useState("auto");
  const [buffered, setBuffered] = useState(0);

  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem("videoVolume");
    return saved ? parseFloat(saved) : 1;
  });
  const [muted, setMuted] = useState(false);

  const [skipIndicator, setSkipIndicator] = useState<{ direction: "forward" | "backward"; visible: boolean }>({ direction: "forward", visible: false });
  const skipTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [savedProgress, setSavedProgress] = useState(0);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [hasResumed, setHasResumed] = useState(false);

  const clickIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const saveProgress = useCallback(() => {
    if (videoId && videoRef.current && hasResumed) {
      const currentTime = Math.floor(videoRef.current.currentTime);
      if (currentTime > 5) {
        saveVideoProgress(videoId, currentTime).catch(() => {});
      }
    }
  }, [videoId, hasResumed]);

  useEffect(() => {
    const video = videoRef.current!;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hlsRef.current = hls;

      hls.on(Hls.Events.MANIFEST_PARSED, () => setLevels(hls.levels));
      hls.on(Hls.Events.ERROR, () => { });
    } else {
      video.src = src;
    }
  }, [src]);

  useEffect(() => {
    if (!videoId) return;
    getVideoProgress(videoId)
      .then((saved) => {
        if (saved > VIDEO_CONFIG.RESUME_THRESHOLD) {
          setSavedProgress(saved);
          setShowResumePrompt(true);
        }
      })
      .catch(() => {});
  }, [videoId]);

  useEffect(() => {
    return () => {
      if (clickIntervalRef.current) clearInterval(clickIntervalRef.current);
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!videoId) return;
    const video = videoRef.current;
    if (!video) return;

    const onPause = () => saveProgress();
    const onEnded = () => saveProgress();

    video.addEventListener("pause", onPause);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("pause", onPause);
      video.removeEventListener("ended", onEnded);
    };
  }, [saveProgress, videoId]);

  useEffect(() => {
    if (!videoId) return;
    if (!playing || hasResumed) return;

    saveIntervalRef.current = setInterval(saveProgress, VIDEO_CONFIG.PROGRESS_SAVE_INTERVAL);
    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [playing, hasResumed, saveProgress, videoId]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      video.muted = muted;
    }
  }, [volume, muted]);

  useEffect(() => {
    const video = videoRef.current!;
    const onTimeUpdate = () => setProgress(video.currentTime);
    const onLoaded = () => { setDuration(video.duration); setBuffering(false); };
    const onWaiting = () => setBuffering(true);
    const onPlaying = () => setBuffering(false);
    const onProgress = () => {
      if (video.buffered.length > 0) {
        setBuffered(video.buffered.end(video.buffered.length - 1));
      }
    };

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("playing", onPlaying);
    video.addEventListener("progress", onProgress);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress", onProgress);
    };
  }, []);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const handleMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), VIDEO_CONFIG.CONTROLS_TIMEOUT);
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.key) {
        case "ArrowLeft":
          video.currentTime = Math.max(0, video.currentTime - VIDEO_CONFIG.SKIP_SECONDS);
          setSkipIndicator({ direction: "backward", visible: true });
          break;
        case "ArrowRight":
          video.currentTime = Math.min(video.duration, video.currentTime + VIDEO_CONFIG.SKIP_SECONDS);
          setSkipIndicator({ direction: "forward", visible: true });
          break;
        case "ArrowUp":
          e.preventDefault();
          setVolume((v) => Math.min(1, v + 0.1));
          if (muted) setMuted(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setVolume((v) => Math.max(0, v - 0.1));
          if (muted) setMuted(false);
          break;
        case "m":
          setMuted(!muted);
          break;
        case " ":
        case "k":
          if (video.paused) video.play();
          else video.pause();
          break;
        case "f":
          if (video.requestFullscreen) video.requestFullscreen();
          break;
      }

      if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
      skipTimeoutRef.current = setTimeout(() => setSkipIndicator((p) => ({ ...p, visible: false })), VIDEO_CONFIG.HIDE_CONTROLS_DELAY);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [muted]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current!;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }, []);

  const handleSeek = (value: number) => {
    videoRef.current!.currentTime = value;
    setProgress(value);
  };

  const handleSkip = (direction: "backward" | "forward") => {
    const video = videoRef.current!;
    const skipAmount = VIDEO_CONFIG.SKIP_SECONDS;
    if (direction === "backward") {
      video.currentTime = Math.max(0, video.currentTime - skipAmount);
    } else {
      video.currentTime = Math.min(video.duration, video.currentTime + skipAmount);
    }
    setSkipIndicator({ direction, visible: true });
    if (skipTimeoutRef.current) clearTimeout(skipTimeoutRef.current);
    skipTimeoutRef.current = setTimeout(() => setSkipIndicator((p) => ({ ...p, visible: false })), VIDEO_CONFIG.HIDE_CONTROLS_DELAY);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    localStorage.setItem("videoVolume", newVolume.toString());
    if (newVolume > 0 && muted) setMuted(false);
  };

  const toggleMute = () => setMuted(!muted);

  const handleQualityChange = (levelIndex: number) => {
    const hls = hlsRef.current;
    if (!hls) return;
    if (levelIndex === -1) {
      hls.currentLevel = -1;
      setQualityLabel("auto");
    } else {
      hls.nextLevel = levelIndex;
      const selected = levels[levelIndex];
      setQualityLabel(selected ? `${selected.height}p` : "auto");
    }
    setCurrentLevel(levelIndex);
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleResume = () => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = savedProgress;
    }
    setShowResumePrompt(false);
    setHasResumed(true);
  };

  const handleStartFresh = () => {
    setShowResumePrompt(false);
    setHasResumed(true);
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      <video ref={videoRef} className="max-w-full max-h-full object-contain" onClick={togglePlay} />

      <SkipIndicator direction={skipIndicator.direction} visible={skipIndicator.visible} />

      {showResumePrompt && (
        <ResumePrompt savedProgress={savedProgress} onResume={handleResume} onStartFresh={handleStartFresh} />
      )}

      {buffering && (
        <div className="absolute inset-0 flex items-center justify-center text-white">
          Loading...
        </div>
      )}

      <VideoControls
        playing={playing}
        progress={progress}
        duration={duration}
        buffered={buffered}
        volume={volume}
        muted={muted}
        levels={levels}
        currentLevel={currentLevel}
        qualityLabel={qualityLabel}
        showControls={showControls}
        onTogglePlay={togglePlay}
        onSeek={handleSeek}
        onSkipBack={() => handleSkip("backward")}
        onSkipForward={() => handleSkip("forward")}
        onVolumeChange={handleVolumeChange}
        onToggleMute={toggleMute}
        onChangeQuality={handleQualityChange}
        onFullscreen={handleFullscreen}
      />
    </div>
  );
}