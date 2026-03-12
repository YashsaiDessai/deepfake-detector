import ProbabilityMeter from "./ProbabilityMeter"
import { useState } from "react"

function UploadBox() {

  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFile = (selectedFile) => {

    if (!selectedFile) return

    setFile(selectedFile)

    const url = URL.createObjectURL(selectedFile)
    setPreview(url)

    setResult(null)
  }

  const handleFileChange = (e) => {
    handleFile(e.target.files[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    handleFile(droppedFile)
  }

  const analyzeFile = () => {

    setLoading(true)

    setTimeout(() => {

      const fakeResult = {
        label: Math.random() > 0.5 ? "Real" : "Fake",
        confidence: (Math.random() * 40 + 60).toFixed(2)
      }

      setResult(fakeResult)
      setLoading(false)

    }, 2000)
  }

  return (

    <div className="bg-slate-800 p-8 rounded-xl shadow-lg w-[450px] text-center space-y-4">

      <div
        className={`border-2 border-dashed rounded-lg p-6 transition ${
          dragging ? "border-blue-400 bg-slate-700" : "border-gray-500"
        }`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >

        <p className="text-gray-300">
          Drag & Drop media here
        </p>

        <p className="text-gray-400 text-sm mt-2">
          or
        </p>

        <input
          type="file"
          onChange={handleFileChange}
          className="mt-3"
        />

      </div>

      {file && (
        <p className="text-green-400 text-sm">
          Uploaded: {file.name}
        </p>
      )}

      {preview && (

        <div className="mt-4">

          {file.type.startsWith("image") && (
            <img src={preview} className="rounded-lg max-h-60 mx-auto" />
          )}

          {file.type.startsWith("video") && (
            <video src={preview} controls className="rounded-lg max-h-60 mx-auto" />
          )}

          {file.type.startsWith("audio") && (
            <audio src={preview} controls className="mx-auto" />
          )}

        </div>

      )}

      {file && !loading && (
        <button
          onClick={analyzeFile}
          className="bg-blue-500 px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Analyze Media
        </button>
      )}

      {loading && (
        <p className="text-blue-400 animate-pulse">
          Scanning with AI...
        </p>
      )}

      {result && (
        <div className="bg-slate-700 p-4 rounded-lg mt-4">

          <h2 className="text-lg font-semibold">
            Detection Result
          </h2>

          <p className={`text-xl font-bold mt-2 ${
            result.label === "Fake"
              ? "text-red-400"
              : "text-green-400"
          }`}>
            {result.label}
          </p>

          {result && (
  <div className="bg-slate-700 p-4 rounded-lg mt-4">

    <h2 className="text-lg font-semibold">
      Detection Result
    </h2>

    <p className={`text-xl font-bold mt-2 ${
      result.label === "Fake"
        ? "text-red-400"
        : "text-green-400"
    }`}>
      {result.label}
    </p>

    <ProbabilityMeter
      label={result.label}
      confidence={result.confidence}
    />

  </div>
)}

        </div>
      )}

    </div>
  )
}

export default UploadBox