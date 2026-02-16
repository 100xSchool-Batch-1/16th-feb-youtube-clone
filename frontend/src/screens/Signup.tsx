import { Appbar } from "@/components/Appbar"
import axios from "axios"

export function Signup() {
    async function signin() {
        axios.post("http://localhost:3000/api/signup", {
            username: document.getElementById("username")!.value,
            password: document.getElementById("password")!.value,
            channelName: document.getElementById("channelName")!.value,
            gender: "Male"
        }).then(response => {
            localStorage.setItem("token", response.data.token)
            window.location = "/signin"
        })
    }

    return <div>
        <input id="username" type="text" placeholder="Username" />
        <input id="password" type="text" placeholder="password" />
        <input id="channelName" type="text" placeholder="channelName" />
        <button onClick={signin}>Sign up</button>
    </div>
}