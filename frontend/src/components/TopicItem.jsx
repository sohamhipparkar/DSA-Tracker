import { useState, useRef, useMemo } from "react";
import { useSheetStore } from "../store/useSheetStore";
import SubtopicItem from "./SubtopicItem";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Plus, Trash2, GripVertical } from "lucide-react";
import "react-circular-progressbar/dist/styles.css";


export default function TopicItem({ topic, search }) {
  const deleteTopic = useSheetStore((s) => s.deleteTopic);
  const addSubtopic = useSheetStore((s) => s.addSubtopic);
  const completed = useSheetStore((s) => s.completed);
  const isDark = document.documentElement.classList.contains("dark");
  const isAdmin = useSheetStore((s) => s.isAdmin);


  const [sub, setSub] = useState("");
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const inputRef = useRef(null);

  // drag & drop
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: topic.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // ===== PROGRESS =====
  const { total, done, percent } = useMemo(() => {
    let total = 0;
    let done = 0;

    topic.subtopics.forEach((s) => {
      s.questions.forEach((q) => {
        total++;
        if (completed.includes(q.id)) done++;
      });
    });

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }, [topic, completed]);

  const handleAddSub = () => {
    const clean = sub.trim();
    if (!clean) return;
    addSubtopic(topic.id, clean);
    setSub("");
    setAdding(false);
  };

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 2000);
      return;
    }
    deleteTopic(topic.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">

          {/* drag handle */}
          {isAdmin && (
  <div {...listeners}

            className="cursor-grab active:cursor-grabbing text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200"
            title="Drag to reorder topic"
          >
            <GripVertical size={18} />
          </div>
)}

          {/* progress ring */}
          <div className="relative w-12 h-12 flex-shrink-0">
            <CircularProgressbar
              value={percent}
              text={`${percent}`}
              strokeWidth={6}
              styles={buildStyles({
                pathColor:
                  percent === 100
                    ? "#10b981"
                    : percent >= 60
                    ? "#3b82f6"
                    : percent >= 30
                    ? "#f59e0b"
                    : "#ef4444",

                trailColor: isDark ? "#334155" : "#e5e7eb",
                textColor: isDark ? "#f1f5f9" : "#334155",
                strokeLinecap: "round",
                textSize: "32px",
              })}
            />
          </div>

          {/* title */}
          <button onClick={() => setOpen(!open)} className="text-left">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {topic.title}
            </h2>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {done} solved • {total - done} remaining
            </p>
          </button>
        </div>

        {/* delete topic */}
        {isAdmin && (
          <button
            onClick={handleDelete}
            className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md transition
          ${
        confirmDelete
        ? "bg-red-500 text-white"
        : "text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-300"
    }`}
  >
    <Trash2 size={16} />
    {confirmDelete ? "Confirm" : "Delete"}
  </button>
)}

      </div>

      {/* BODY */}
      {open && (
        <div className="mt-5">

          {/* ADD SUBTOPIC BUTTON */}
          {isAdmin && !adding && (
            <button
              onClick={() => {
                setAdding(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm mb-4"
            >
              <Plus size={16} />
              Add subtopic
            </button>
          )}

          {/* ADD SUBTOPIC INPUT */}
          {adding && (
            <div className="flex gap-2 mb-5">
              <input
                ref={inputRef}
                className="flex-1 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Subtopic name (e.g., Sliding Window)"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSub()}
              />

              <button
                onClick={handleAddSub}
                disabled={!sub.trim()}
                className={`px-4 rounded-xl text-white transition
                ${
                  sub.trim()
                    ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "bg-blue-300 dark:bg-slate-700 cursor-not-allowed"
                }`}
              >
                Add
              </button>

              <button
                onClick={() => setAdding(false)}
                className="px-3 border border-slate-300 dark:border-slate-600 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          )}

          {/* SUBTOPICS */}
          <div className="space-y-4">
            {topic.subtopics.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                No subtopics yet. Add your first one 👆
              </p>
            )}

            {topic.subtopics.map((s) => (
              <SubtopicItem
                key={s.id}
                sub={s}
                topicId={topic.id}
                search={search}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
