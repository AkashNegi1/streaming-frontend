export default function SkeletonLoader({ type = 'card' }: { type?: 'card' | 'hero' }) {
  if (type === 'hero') {
    return (
      <div className="relative w-full h-[70vh] bg-gradient-to-r from-gray-800 to-gray-900 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute bottom-20 left-10 md:left-20 space-y-4">
          <div className="h-12 w-96 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-80 bg-gray-700 rounded animate-pulse" />
          <div className="h-6 w-64 bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-4 mt-6">
            <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
            <div className="h-12 w-32 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 overflow-hidden px-4 py-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="flex-shrink-0 w-64 h-36 bg-gray-800 rounded-md animate-pulse"
        />
      ))}
    </div>
  );
}
