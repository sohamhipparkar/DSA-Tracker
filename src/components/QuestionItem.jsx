import { useSheetStore } from "../store/useSheetStore";
import { Trash2, ExternalLink, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function QuestionItem({ q, topicId, subId }) {
  const deleteQuestion = useSheetStore((s) => s.deleteQuestion);
  const toggleComplete = useSheetStore((s) => s.toggleComplete);
  const completed = useSheetStore((s) => s.completed);

  const [confirmDelete, setConfirmDelete] = useState(false);

  const done = completed.includes(q.id);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2000);
      return;
    }
    deleteQuestion(topicId, subId, q.id);
  };

  return (
    <div
      className={`group flex items-center justify-between p-3 rounded-xl border transition-all
      ${
        done
          ? "bg-emerald-50 border-emerald-200"
          : "bg-slate-50 border-slate-200 hover:bg-slate-100"
      }`}
    >
      {/* LEFT SIDE */}
      <div className="flex items-center gap-3">

        {/* Animated Checkbox */}
        <button
          onClick={() => toggleComplete(q.id)}
          aria-label="Mark question as completed"
          className="focus:outline-none"
        >
          {done ? (
            <CheckCircle2 className="text-emerald-500 w-5 h-5 transition scale-110" />
          ) : (
            <div className="w-5 h-5 rounded-md border-2 border-slate-400 group-hover:border-blue-500 transition" />
          )}
        </button>

        {/* Question Link */}
        <a
          href={q.link}
          target="_blank"
          rel="noreferrer"
          className={`flex items-center gap-2 transition
          ${
            done
              ? "line-through text-slate-400 pointer-events-none"
              : "text-blue-600 hover:text-blue-700"
          }`}
        >
          {q.title}
          {!done && <ExternalLink size={14} />}
        </a>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={handleDelete}
        className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md transition
        ${
          confirmDelete
            ? "bg-red-500 text-white"
            : "text-red-400 hover:text-red-600 hover:bg-red-50"
        }`}
      >
        <Trash2 size={14} />
        {confirmDelete ? "Confirm" : "Delete"}
      </button>
    </div>
  );
}
