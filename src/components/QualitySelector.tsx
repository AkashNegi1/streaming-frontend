import type { Level } from "hls.js";

interface QualitySelectorProps {
  levels: Level[];
  currentLevel: number;
  qualityLabel: string;
  onChangeQuality: (levelIndex: number) => void;
}

export default function QualitySelector({ levels, currentLevel, qualityLabel, onChangeQuality }: QualitySelectorProps) {
  if (levels.length === 0) return null;

  return (
    <div className="dropdown dropdown-top dropdown-end rounded-md">
      <div tabIndex={0} role="button" className="btn m-1">
        {qualityLabel} ⚙️
      </div>
      <div className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm">
        <button
          onClick={() => onChangeQuality(-1)}
          className={currentLevel === -1 ? "text-red-500 m-2 cursor-pointer" : "m-2 cursor-pointer"}
        >
          Auto
        </button>
        {levels.map((level, index) => (
          <button
            key={index}
            onClick={() => onChangeQuality(index)}
            className={
              currentLevel === index
                ? "text-red-500 m-2 cursor-pointer"
                : "m-2 cursor-pointer"
            }
          >
            {level.height}p
          </button>
        ))}
      </div>
    </div>
  );
}