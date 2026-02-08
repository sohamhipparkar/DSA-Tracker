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

  // ===== CALCULATE TOPIC PROGRESS =====
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
      className="group bg-white shadow-sm hover:shadow-md p-5 rounded-2xl transition-all border border-slate-200"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* drag handle */}
          <div
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-700"
            title="Drag to reorder topic"
          >
            <GripVertical size={18} />
          </div>

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
                trailColor: "#e5e7eb",
                strokeLinecap: "round",
                textColor: "#334155",
                textSize: "32px",
              })}
            />
          </div>

          {/* title */}
          <button onClick={() => setOpen(!open)} className="text-left">
            <h2 className="text-lg font-bold text-slate-800">{topic.title}</h2>
            <p className="text-xs text-slate-500">
              {done} solved • {total - done} remaining
            </p>
          </button>
        </div>

        {/* delete topic */}
        <button
          onClick={handleDelete}
          className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md transition ${
            confirmDelete
              ? "bg-red-500 text-white"
              : "text-red-400 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          <Trash2 size={16} />
          {confirmDelete ? "Confirm" : "Delete"}
        </button>
      </div>

      {/* BODY */}
      {open && (
        <div className="mt-5">
          {/* ADD SUBTOPIC BUTTON */}
          {!adding && (
            <button
              onClick={() => {
                setAdding(true);
                setTimeout(() => inputRef.current?.focus(), 100);
              }}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm mb-4"
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
                className="flex-1 border rounded-xl p-2.5"
                placeholder="Subtopic name (e.g., Sliding Window)"
                value={sub}
                onChange={(e) => setSub(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddSub()}
              />

              <button
                onClick={handleAddSub}
                disabled={!sub.trim()}
                className={`px-4 rounded-xl text-white ${
                  sub.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-300 cursor-not-allowed"
                }`}
              >
                Add
              </button>

              <button
                onClick={() => setAdding(false)}
                className="px-3 border rounded-xl"
              >
                Cancel
              </button>
            </div>
          )}

          {/* SUBTOPICS */}
          <div className="space-y-4">
            {topic.subtopics.length === 0 && (
              <p className="text-sm text-slate-500 italic">
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