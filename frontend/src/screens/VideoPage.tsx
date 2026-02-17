import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { VideoCard } from "../components/VideoCard";

export function VideoPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [videoDetails, setVideoDetails] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [recommendedVideo, setRecommendedVideos] = useState([]);

    const id = searchParams.get("id")

    useEffect(() => {
        axios.get("http://localhost:3000/api/videos/" + id)
            .then(response => {
                setVideoDetails(response.data);
                setIsLoading(false)
            })
    }, [id])

    useEffect(() => {
        axios.get("http://localhost:3000/api/videos")
            .then(response => {
                const data = response.data;
                setRecommendedVideos(data);
            })
    }, [])

    if (isLoading) {
        return <div>
            Loading...
        </div>
    }

    return <div style={{display: "flex", justifyContent: "space-between"}}>
        <div>
            <video src={videoDetails.videoUrl} />
            <br />
            <div>
                {videoDetails.title}
            </div>
            <div>
                {videoDetails.user.channelName}
            </div>
            <div>
                <img src={videoDetails.user.profilePicture} />
            </div>
        </div>
        <div>
            {recommendedVideo.map(video => <VideoCard 
                href={`/watch?id=${video.id}`}
                imageUrl={video.thumbnail}
                title={video.title}
                channelImage={video.user.profilePicture}
                channelName={video.user.channelName}
            />)}
        </div>

        
    </div>
}