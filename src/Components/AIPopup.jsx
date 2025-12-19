export default function AIPopup({ original, generated, onConfirm, onReject }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl p-6 space-y-5">
        <h2 className="text-lg font-semibold text-center">AI Suggestion</h2>

        {/* Original Text */}
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium mb-1 text-gray-700">
            Original Text
          </p>
          <div
            className="
              w-full
              p-3
              bg-gray-100
              rounded-lg
              whitespace-pre-wrap
              text-sm
              text-left
              align-top
            "
          >
            {original}
          </div>
        </div>

        {/* AI Generated Text */}
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium mb-1 text-gray-700">
            AI Generated Text
          </p>
          <div
            className="
              w-full
              p-3
              bg-green-50
              rounded-lg
              whitespace-pre-wrap
              text-sm
              text-left
              align-top
            "
          >
            {generated}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onReject}
            className="px-4 py-2 curosr-pointer rounded-lg border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 cursor-pointer rounded-lg bg-black text-white hover:bg-gray-800"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
