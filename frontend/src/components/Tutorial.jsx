import { useState, useEffect } from "react";

const steps = [
  {
    title: "Welcome 👋",
    desc: "This platform helps you track your DSA problem solving progress.",
  },
  {
    title: "Solving Problems ✔",
    desc: "Click the checkbox beside a problem after solving it. Your progress updates automatically.",
  },
  {
    title: "Search 🔎",
    desc: "Use the search bar to quickly find a specific topic or question.",
  },
  {
    title: "Admin Mode 🔐",
    desc: "To add or delete topics, subtopics, or questions, enable Admin Mode from the top right button.",
  },
  {
    title: "You're Ready 🚀",
    desc: "Start solving problems and track your journey consistently!",
  },
];

export default function TutorialModal() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("seenTutorial");
    if (!seen) setOpen(true);
  }, []);

  const next = () => {
    if (step === steps.length - 1) {
      localStorage.setItem("seenTutorial", "true");
      setOpen(false);
    } else {
      setStep(step + 1);
    }
  };

  const skip = () => {
    localStorage.setItem("seenTutorial", "true");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

      <div className="w-[90%] max-w-md bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl animate-fadeIn">

        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-3">
          {steps[step].title}
        </h2>

        <p className="text-slate-600 dark:text-slate-300 mb-6">
          {steps[step].desc}
        </p>

        <div className="flex justify-between items-center">

          <button
            onClick={skip}
            className="text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            Skip
          </button>

          <button
            onClick={next}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
          >
            {step === steps.length - 1 ? "Start Using" : "Next"}
          </button>
        </div>

        {/* dots indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${
                i === step
                  ? "bg-blue-600"
                  : "bg-slate-300 dark:bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
