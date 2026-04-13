import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadVideo } from "../api/videos";

export default function UploadPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError("");

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
      } else {
        setError("Please upload a video file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      await uploadVideo(file);

      clearInterval(interval);
      setProgress(100);

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(error.response?.data?.message || "Upload failed. Please try again.");
      setUploading(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Upload Video
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-500 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="bg-gray-900 rounded-lg p-8 shadow-2xl">
          <form
            onDragEnter={handleDrag}
            onSubmit={(e) => e.preventDefault()}
            className="space-y-6"
          >
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-red-500 bg-red-500/10"
                  : "border-gray-700 hover:border-gray-500"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
                id="video-upload"
              />

              {file ? (
                <div className="space-y-4">
                  <div className="text-4xl">🎬</div>
                  <p className="text-white font-medium">{file.name}</p>
                  <p className="text-gray-400 text-sm">
                    {formatFileSize(file.size)}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="text-red-500 hover:text-red-400 text-sm"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <label htmlFor="video-upload" className="cursor-pointer">
                  <div className="text-4xl mb-4">📤</div>
                  <p className="text-white font-medium mb-2">
                    Drag and drop your video here
                  </p>
                  <p className="text-gray-400 text-sm mb-4">
                    or click to browse
                  </p>
                  <p className="text-gray-500 text-xs">
                    Supported formats: MP4, MOV, AVI, MKV
                  </p>
                </label>
              )}
            </div>

            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Uploading...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-gray-500 text-sm text-center">
                  {progress < 100
                    ? "Please wait while we process your video..."
                    : "Processing complete!"}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded transition-colors"
            >
              {uploading ? "Uploading..." : "Upload Video"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
