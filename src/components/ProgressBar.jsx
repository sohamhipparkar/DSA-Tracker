import { useSheetStore } from "../store/useSheetStore";

export default function ProgressBar() {
  const getProgress = useSheetStore((s) => s.getProgress);
  const { total, done, percent } = getProgress();

  // prevent NaN
  const safePercent = total === 0 ? 0 : percent;

  // dynamic color
  const getColor = () => {
    if (safePercent === 100) return "bg-emerald-500";
    if (safePercent >= 75) return "bg-green-500";
    if (safePercent >= 50) return "bg-yellow-500";
    if (safePercent >= 25) return "bg-orange-400";
    return "bg-red-400";
  };

  // motivational messages
  const getMessage = () => {
    if (total === 0)
      return "Start by adding your first topic 👇";

    if (safePercent === 100)
      return "Perfect! You completed everything 🎉";

    if (safePercent >= 75)
      return "Almost there! Final push 🚀";

    if (safePercent >= 50)
      return "Great progress! Keep going 💪";

    if (safePercent >= 25)
      return "Nice start! Consistency matters 🔁";

    return "Let’s begin your journey 📚";
  };

  return (
    <div className="<div className=rounded-2xl p-5 bg-slate-50 border border-slate-200">
      
      {/* header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg">Your Study Progress</h2>
        <span className="text-slate-600 text-sm font-medium">
          {total === 0 ? "0 topics" : `${done} of ${total}`}
        </span>
      </div>

      {/* progress bar */}
      <div
        className="w-full h-4 bg-slate-200 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={safePercent}
      >
        <div
          className={`h-4 rounded-full transition-all duration-700 ease-out ${getColor()}`}
          style={{ width: `${safePercent}%` }}
        />
      </div>

      {/* percent + message */}
      <div className="flex justify-between mt-3 text-sm">
        <span className="text-slate-600 font-medium">
          {safePercent}% completed
        </span>
        <span className="text-slate-500">
          {getMessage()}
        </span>
      </div>
    </div>
  );
}
