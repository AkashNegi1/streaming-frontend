import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStreamUrl } from "../api/videos.js";
import VideoPlayer from "../components/VideoPlayer.jsx";
import Navbar from "../components/NavBar";
import AuthErrorModal from "../utils/Error.js"
export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    // Check if the error exists and if it's an authorization error (e.g., 401)
    // Adjust this condition based on how your API returns errors!
    if (error) {
      setIsModalOpen(true);
    }
  }, [error]);
  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const streamUrl = await getStreamUrl(id);
        setUrl(streamUrl);
      } catch {
        setError(true);
      }finally{
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if(loading){
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <span className="loading loading-ring loading-xl"></span>
      </div>
    )
  }
  if (error || !url) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-white">
            {error ? "Unable to load video." : "Loading..."}
          </p>
        </div>
      <AuthErrorModal isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}/>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
        <Navbar />
      <div className="">
        <VideoPlayer src={url} videoId={id} />
      </div>
    </div>
  );
}
