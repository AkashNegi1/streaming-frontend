import { FaPlay, FaPause, FaForward, FaBackward } from "react-icons/fa";
import { RiFullscreenFill } from "react-icons/ri";
import type { Level } from "hls.js";
import VolumeSlider from "./VolumeSlider";
import QualitySelector from "./QualitySelector";

interface VideoControlsProps {
  playing: boolean;
  progress: number;
  duration: number;
  buffered: number;
  volume: number;
  muted: boolean;
  levels: Level[];
  currentLevel: number;
  qualityLabel: string;
  showControls: boolean;
  onTogglePlay: () => void;
  onSeek: (value: number) => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
  onChangeQuality: (levelIndex: number) => void;
  onFullscreen: () => void;
}

function formatTime(time: number): string {
  if (!time || !isFinite(time)) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VideoControls({
  playing,
  progress,
  duration,
  buffered,
  volume,
  muted,
  levels,
  currentLevel,
  qualityLabel,
  showControls,
  onTogglePlay,
  onSeek,
  onSkipBack,
  onSkipForward,
  onVolumeChange,
  onToggleMute,
  onChangeQuality,
  onFullscreen,
}: VideoControlsProps) {
  if (!showControls) return null;

  return (
    <div className="absolute bottom-0 w-full bg-gradient-to-t from-black p-4 text-white">
      <div className="relative w-full h-2 bg-gray-700 rounded">
        <div
          className="absolute h-2 bg-gray-400 rounded"
          style={{ width: `${(buffered / duration) * 100}%` }}
        />
        <div
          className="absolute h-2 bg-red-500 rounded"
          style={{ width: `${(progress / duration) * 100}%` }}
        />
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute w-full h-2 opacity-0 cursor-pointer"
        />
      </div>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-4 items-center">
          <button onClick={onTogglePlay}>
            {playing ? <FaPause /> : <FaPlay />}
          </button>

          <button onClick={onSkipBack}>
            <FaBackward />
          </button>

          <button onClick={onSkipForward}>
            <FaForward />
          </button>

          <VolumeSlider
            volume={volume}
            muted={muted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />

          <span>
            {formatTime(progress)} / {formatTime(duration)}
          </span>
        </div>

        <div className="flex gap-3">
          <QualitySelector
            levels={levels}
            currentLevel={currentLevel}
            qualityLabel={qualityLabel}
            onChangeQuality={onChangeQuality}
          />

          <button onClick={onFullscreen}>
            <RiFullscreenFill />
          </button>
        </div>
      </div>
    </div>
  );
}