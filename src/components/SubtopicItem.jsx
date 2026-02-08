import { useState, useRef } from "react";
import { useSheetStore } from "../store/useSheetStore";
import QuestionItem from "./QuestionItem";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";

export default function SubtopicItem({ sub, topicId, search }) {
  const deleteSubtopic = useSheetStore((s) => s.deleteSubtopic);
  const addQuestion = useSheetStore((s) => s.addQuestion);
  const completed = useSheetStore((s) => s.completed);

  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const titleRef = useRef(null);

  // filter search
  const filtered = sub.questions.filter((q) =>
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  // progress inside subtopic
  const total = sub.questions.length;
  const done = sub.questions.filter((q) => completed.includes(q.id)).length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);

  const handleAdd = () => {
    const clean = title.trim();
    if (!clean) return;

    // auto-fix link
    let fixedLink = link.trim();
    if (fixedLink && !fixedLink.startsWith("http"))
      fixedLink = "https://" + fixedLink;

    addQuestion(topicId, sub.id, clean, fixedLink);

    setTitle("");
    setLink("");
    setAdding(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2000);
      return;
    }
    deleteSubtopic(topicId, sub.id);
  };

  return (
    <div className="pl-4 border-l-2 border-slate-200 mb-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-left"
        >
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}

          <h3 className="font-semibold text-slate-800">
            {sub.title}
          </h3>

          {/* progress badge */}
          <span
            className={`text-xs px-2 py-1 rounded-full
            ${
              percent === 100
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {done}/{total}
          </span>
        </button>

        {/* delete subtopic */}
        <button
          onClick={handleDelete}
          className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition
          ${
            confirmDelete
              ? "bg-red-500 text-white"
              : "text-red-400 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <Trash2 size={14} />
          {confirmDelete ? "Confirm" : "Remove"}
        </button>
      </div>

      {/* CONTENT */}
      {open && (
        <div className="mt-3">

          {/* ADD QUESTION BUTTON */}
          {!adding && (
            <button
              onClick={() => {
                setAdding(true);
                setTimeout(() => titleRef.current?.focus(), 100);
              }}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 mb-3"
            >
              <Plus size={16} />
              Add a question
            </button>
          )}

          {/* ADD QUESTION PANEL */}
          {adding && (
            <div className="bg-slate-50 border rounded-xl p-3 mb-4 space-y-2">
              <input
                ref={titleRef}
                className="w-full border rounded-md p-2"
                placeholder="Problem name (e.g., Two Sum)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />

              <input
                className="w-full border rounded-md p-2"
                placeholder="Problem link (LeetCode, GFG...)"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  disabled={!title.trim()}
                  className={`px-3 py-2 rounded-md text-white
                  ${
                    title.trim()
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  Add Question
                </button>

                <button
                  onClick={() => setAdding(false)}
                  className="px-3 py-2 rounded-md border"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {filtered.length === 0 && (
            <p className="text-sm text-slate-500 italic">
              No questions yet. Add your first problem 👆
            </p>
          )}

          {/* QUESTIONS */}
          <div className="space-y-2">
            {filtered.map((q) => (
              <QuestionItem
                key={q.id}
                q={q}
                topicId={topicId}
                subId={sub.id}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
