import { useCallback, useEffect, useState } from "react";
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
  status: 'PROCESSING' | 'READY' | 'FAILED';
}

const HomePage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [featuredVideo, setFeaturedVideo] = useState<FeaturedVideo | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshVideos = useCallback(async ()=>{
    try {
      const [allVideos, featured] = await Promise.all([
        getAllVideos(),
        getFeaturedVideo()
      ]);
      setVideos(allVideos);
      setFeaturedVideo(featured);
    } catch (error) {
      console.error("Failed to fetch videos:", error);
    }
  },[])
  
  useEffect(() => {
    let isMounted = true; //  Protects against unmount memory leaks

    const loadInitialData = async () => {
      // 1. Wait for the data to fetch
      await refreshVideos(); 

      // 2. Only turn off the loading skeleton if the user is still on the page!
      if (isMounted) {
        setLoading(false);
      }
    };

    loadInitialData();

    // 3. The Cleanup Function
    // If the component unmounts before the fetch finishes, this flips to false
    return () => {
      isMounted = false;
    };
  }, [refreshVideos]);

  return (
    <div className="h-full bg-black">
      <Navbar />
      <HeroBanner video={featuredVideo} loading={loading} />
      
      <div className="relative z-10 pb-8 px-10">
        <VideoRow
          title="All Videos"
          videos={videos}
          loading={loading}
          onRefresh={refreshVideos}
        />
      </div>
    </div>
  );
};

export default HomePage;
