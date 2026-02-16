import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { VideoPage } from "./screens/VideoPage";
import { Signin } from "./screens/Signin";
import { Signup } from "./screens/Signup";
import { Landing } from "./screens/Landing";
import { Upload } from "./screens/Upload";
import { Appbar } from "./components/Appbar";
import axios from "axios";


export function App() {
  return (
    <div>
      <Appbar />
      <BrowserRouter>
        <Routes>
          <Route path="/watch" element={<VideoPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
