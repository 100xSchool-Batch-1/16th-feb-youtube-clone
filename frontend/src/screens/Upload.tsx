import axios from "axios"

export function Upload() {


    async function upload() {
        await axios.post("http://localhost:3000/api/videos", {
            videoUrl: document.getElementById("videoUrl")!.value,
            thumbnail: document.getElementById("thumbnail")!.value
        }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })
    }

    return <div>
        <input id="videoUrl" type="text" placeholder="Vidoe url"></input>
        <input id="thumbnail" type="text" placeholder="thumbnail"></input>
        <button onClick={upload}>Complete upoad</button>
        upload page
    </div>
}