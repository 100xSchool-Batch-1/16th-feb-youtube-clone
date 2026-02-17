import axios from "axios"
import { useState } from "react";

export function Upload() {
    const [videoUrl, setVideoUrl] = useState("")
    const [thumbnaiulUrl, setThumbnailUrl] = useState("")

    return <div>
        <input type="file" onChange={async (e, files) => {
            const file = e.target.files[0];
            console.log(file);

            const response = await axios.post("http://localhost:3000/getPresignedUrl")
            const { putUrl, finalVideoUrl } = response.data;

            const options = {
                method: 'PUT',
                url: putUrl,
                headers: { 'Content-Type': file.type },
                data: file
            };

            await axios.request(options);
            setVideoUrl(finalVideoUrl);

            alert("video upload done")
        }}></input>
         <input type="file" onChange={async (e, files) => {
            const file = e.target.files[0];
            console.log(file);

            const response = await axios.post("http://localhost:3000/getPresignedUrl")
            const { putUrl, finalVideoUrl } = response.data;

            const options = {
                method: 'PUT',
                url: putUrl,
                headers: { 'Content-Type': file.type },
                data: file
            };

            await axios.request(options);
            setThumbnailUrl(finalVideoUrl);

            alert("video upload done")
        }}></input>
        <button onClick={() => {
            if (!videoUrl) {
                alert("video not uploaded yet")
                return
            }
            axios.post("http://localhost:3000/api/video", {
                videoUrl,
                thumbnaiulUrl
            })
        }}>Complete upoad</button>
        upload page
    </div>
}