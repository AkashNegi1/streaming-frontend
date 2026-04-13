import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStreamUrl } from "../api/videos.js";
import VideoPlayer from "../components/VideoPlayer.jsx";
import Navbar from "../components/NavBar";

export default function WatchPage() {
  const { id } = useParams<{ id: string }>();
  const [url, setUrl] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
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
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }
  if (error || !url) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-white text-xl">Video not found</div>
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
