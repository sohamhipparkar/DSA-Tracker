import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSheetStore } from "../store/useSheetStore";
import TopicItem from "./TopicItem";
import { useMemo } from "react";

export default function TopicList({ search }) {
  const topics = useSheetStore((s) => s.topics);
  const completed = useSheetStore((s) => s.completed);
  const reorderTopics = useSheetStore((s) => s.reorderTopics);

  // ===== DRAG HANDLER =====
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = topics.findIndex((t) => t.id === active.id);
    const newIndex = topics.findIndex((t) => t.id === over.id);

    reorderTopics(oldIndex, newIndex);
  };

  // ===== OVERALL PROGRESS =====
  const { total, done, percent } = useMemo(() => {
    // Safety check: ensure topics is an array
    if (!Array.isArray(topics)) {
      return { total: 0, done: 0, percent: 0 };
    }

    let total = 0;
    let done = 0;

    topics.forEach((t) => {
      // Safety check: ensure subtopics exists and is an array
      if (Array.isArray(t.subtopics)) {
        t.subtopics.forEach((s) => {
          // Safety check: ensure questions exists and is an array
          if (Array.isArray(s.questions)) {
            s.questions.forEach((q) => {
              total++;
              if (completed.includes(q.id)) done++;
            });
          }
        });
      }
    });

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }, [topics, completed]);

  // ===== CONTINUE WHERE LEFT OFF =====
  const nextQuestion = useMemo(() => {
    // Safety check: ensure topics is an array
    if (!Array.isArray(topics)) {
      return null;
    }

    for (const t of topics) {
      // Safety check for subtopics
      if (Array.isArray(t.subtopics)) {
        for (const s of t.subtopics) {
          // Safety check for questions
          if (Array.isArray(s.questions)) {
            for (const q of s.questions) {
              if (!completed.includes(q.id)) {
                return q;
              }
            }
          }
        }
      }
    }
    return null;
  }, [topics, completed]);

  // ===== FILTERED TOPICS (SEARCH) =====
  const filteredTopics = Array.isArray(topics)
    ? topics.filter((topic) =>
        topic?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">

      {/* GLOBAL PROGRESS SUMMARY */}
      {total > 0 && (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-semibold text-lg">Your Sheet Progress</h2>
            <span className="text-sm text-slate-600">
              {done} / {total} solved
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className={`h-3 rounded-full transition-all duration-700
              ${
                percent === 100
                  ? "bg-emerald-500"
                  : percent >= 60
                  ? "bg-blue-500"
                  : percent >= 30
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          <p className="text-sm text-slate-500 mt-2">
            {percent === 100
              ? "Amazing! You completed the entire sheet 🎉"
              : `${percent}% completed`}
          </p>
        </div>
      )}

      {/* CONTINUE BUTTON */}
      {nextQuestion && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-700 font-medium">
              Continue solving
            </p>
            <p className="text-xs text-blue-600">
              Next: {nextQuestion.title}
            </p>
          </div>

          <a
            href={nextQuestion.link}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium"
          >
            Open Problem
          </a>
        </div>
      )}

      {/* TOPIC LIST */}
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={filteredTopics.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-5">

            {/* NORMAL LIST */}
            {filteredTopics.length > 0 ? (
              filteredTopics.map((topic) => (
                <TopicItem key={topic.id} topic={topic} search={search} />
              ))
            ) : topics.length === 0 ? (
              /* EMPTY STATE */
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="mb-4">
                  <span className="text-5xl">📚</span>
                </div>
                <p className="text-slate-800 text-lg font-medium mb-2">
                  Start your DSA journey
                </p>
                <p className="text-slate-500 text-sm max-w-md mx-auto">
                  Add a topic above (Arrays, Graphs, DP...) and begin tracking the problems you solve.
                </p>
              </div>
            ) : (
              /* SEARCH EMPTY */
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="mb-4">
                  <span className="text-4xl">🔍</span>
                </div>
                <p className="text-slate-800 font-medium mb-2">
                  No matching topics
                </p>
                <p className="text-slate-500 text-sm">
                  Try a different search term.
                </p>
              </div>
            )}

          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
