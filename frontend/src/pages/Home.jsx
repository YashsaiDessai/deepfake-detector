import UploadBox from "../components/UploadBox"

function Home() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center gap-8">

      <h1 className="text-5xl font-bold">
        Deepfake & Voice Detector
      </h1>

      <p className="text-gray-400">
        Upload video, image, or audio to detect AI manipulation
      </p>

      <UploadBox />

    </div>
  )
}

export default Home