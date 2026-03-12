function ProbabilityMeter({ label, confidence }) {

  const percentage = Number(confidence)

  const color =
    label === "Fake"
      ? "bg-red-500"
      : "bg-green-500"

  return (
    <div className="mt-4">

      <div className="flex justify-between text-sm mb-1">
        <span>Real</span>
        <span>Fake</span>
      </div>

      <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">

        <div
          className={`${color} h-4 transition-all duration-700`}
          style={{ width: `${percentage}%` }}
        />

      </div>

      <p className="text-center mt-2 text-gray-300">
        Confidence: {confidence}%
      </p>

    </div>
  )
}

export default ProbabilityMeter