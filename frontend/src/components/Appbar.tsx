
export function Appbar() {
    return <div style={{"display": "flex", justifyContent: "space-between"}}>
        <div>
            Youtube
        </div>
        <div>
            <button onClick={() => window.location = "/upload"}>Upload</button>
        </div>
    </div>
}