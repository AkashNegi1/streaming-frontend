interface ResumePromptProps {
  savedProgress: number;
  onResume: () => void;
  onStartFresh: () => void;
}

function formatTime(time: number): string {
  if (!time) return "0:00";
  const m = Math.floor(time / 60);
  const s = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

export default function ResumePrompt({ savedProgress, onResume, onStartFresh }: ResumePromptProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
      <div className="bg-gray-900 p-6 rounded-lg text-center text-white max-w-sm">
        <p className="text-lg mb-2">Resume from where you left off?</p>
        <p className="text-gray-400 mb-4">You were at {formatTime(savedProgress)}</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onResume}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded font-semibold"
          >
            Resume
          </button>
          <button
            onClick={onStartFresh}
            className="bg-gray-700 hover:bg-gray-600 px-6 py-2 rounded font-semibold"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}