import { FaForward, FaBackward } from "react-icons/fa";

interface SkipIndicatorProps {
  direction: "forward" | "backward";
  visible: boolean;
}

export default function SkipIndicator({ direction, visible }: SkipIndicatorProps) {
  if (!visible) return null;

  return (
    <div className={`absolute top-1/2 ${direction === "forward" ? "right-1/4" : "left-1/4"} -translate-y-1/2 flex flex-col items-center text-white text-2xl font-bold animate-pulse`}>
      <div className={`text-4xl ${direction === "forward" ? "text-green-400" : "text-blue-400"}`}>
        {direction === "forward" ? <FaForward /> : <FaBackward />}
      </div>
      <span>10s</span>
    </div>
  );
}