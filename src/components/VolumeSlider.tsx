import { useState } from "react";
import { FaVolumeMute, FaVolumeDown, FaVolumeUp } from "react-icons/fa";

interface VolumeSliderProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
}

export default function VolumeSlider({ volume, muted, onVolumeChange, onToggleMute }: VolumeSliderProps) {
  const [showSlider, setShowSlider] = useState(false);

  const getIcon = () => {
    if (muted || volume === 0) return <FaVolumeMute />;
    if (volume < 0.5) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  const handleMouseLeave = () => {
    setTimeout(() => setShowSlider(false), 300);
  };

  return (
    <div 
      className="flex items-center gap-2 relative"
      onMouseEnter={() => setShowSlider(true)}
      onMouseLeave={handleMouseLeave}
    >
      <button onClick={onToggleMute}>
        {getIcon()}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={muted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        className="w-20 h-1 accent-red-500 cursor-pointer"
      />
      {showSlider && (
        <div className="absolute bottom-full mb-2 bg-gray-900 px-3 py-1 rounded text-sm">
          {Math.round((muted ? 0 : volume) * 100)}%
        </div>
      )}
    </div>
  );
}