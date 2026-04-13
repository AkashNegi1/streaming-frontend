import  api  from './client'
const VITE_API_URL = import.meta.env.VITE_API_URL;

export const getStreamUrl = async (id:string) => {
    
    const res = await api.get(`/videos/${id}/play`);
    
    return `${VITE_API_URL}${res.data.streamUrl}`;
}

export const getVideoProgress = async (id: string) => {
    const res = await api.get(`/videos/${id}/progress`);
    return res.data.progress as number;
};

export const saveVideoProgress = async (id: string, progress: number) => {    
    await api.patch(`/videos/${id}/progress`, { progress });
};

export const getAllVideos = async () => {
    const res = await api.get("/videos");
    return res.data as Array<{id: string, title: string, thumbnailUrl: string, duration: number}>;
}

export interface FeaturedVideo {
    id: string;
    title: string;
    description: string | null;
    thumbnailUrl: string | null;
    duration: number | null;
    streamUrl: string | null;
}

export const getFeaturedVideo = async (): Promise<FeaturedVideo | null> => {
    const res = await api.get("/videos/featured");
    return res.data as FeaturedVideo;
}

export const uploadVideo = async (file: File) => {
    const formData = new FormData();
    formData.append("video", file);
    
    const res = await api.post("/videos/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    
    return res.data;
};

