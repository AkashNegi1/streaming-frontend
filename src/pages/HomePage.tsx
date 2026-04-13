import { useEffect, useState } from "react";
import { getAllVideos, getFeaturedVideo } from "../api/videos";
import type { FeaturedVideo } from "../api/videos";
import HeroBanner from "../components/HeroBanner";
import VideoRow from "../components/VideoRow";
import Navbar from "../components/NavBar";

interface Video {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  duration: number | null;
}

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allVideos, featured] = await Promise.all([
          getAllVideos(),
          getFeaturedVideo()
        ]);
        
        setVideos(allVideos);
        setFeaturedVideo(featured);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-full bg-black">
      <Navbar />
      <HeroBanner video={featuredVideo} loading={loading} />
      
      <div className="relative z-10 pb-8 px-10">
        <VideoRow
          title="All Videos"
          videos={videos}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default HomePage;
