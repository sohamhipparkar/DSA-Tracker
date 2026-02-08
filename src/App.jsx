import { useEffect, useState } from "react";
import axios from "axios";
import { useSheetStore } from "./store/useSheetStore";
import AddTopic from "./components/AddTopic";
import TopicList from "./components/TopicList";
import ProgressBar from "./components/ProgressBar";

export default function App() {
  const setTopicsFromAPI = useSheetStore((s) => s.setTopicsFromAPI);
  const topics = useSheetStore((s) => s.topics);
  const completed = useSheetStore((s) => s.completed);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ===== FETCH SHEET =====
  const fetchSheet = async () => {
    try {
      setError(false);
      setLoading(true);

      const res = await axios.get(
        "https://node.codolio.com/api/question-tracker/v1/sheet/public/get-sheet-by-slug/striver-sde-sheet"
      );

      const apiData = res.data.data;

      const formattedTopics = apiData.sections.map((section) => ({
        id: section.id,
        title: section.name,
        subtopics: [
          {
            id: section.id + "-sub",
            title: "Questions",
            questions: section.questions.map((q) => ({
              id: q.id,
              title: q.title,
              link: q.url,
            })),
          },
        ],
      }));

      setTopicsFromAPI(formattedTopics);
    } catch (err) {
      console.log("API failed", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (topics.length === 0) fetchSheet();
    else setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-slate-50 to-white">
      <div className="max-w-6xl mx-auto px-5 py-10">

        {/* ================= HERO ================= */}
        <div className="mb-10 rounded-3xl p-8 bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-500 text-white shadow-xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            DSA Tracker
          </h1>

          <p className="mt-3 text-blue-100 max-w-xl">
            Track your progress, stay consistent, and systematically complete the Striver SDE Sheet.
          </p>

          <div className="mt-6 flex items-center gap-6 text-sm text-blue-100">
            <div>
              <span className="block text-2xl font-semibold text-white">
                {topics.length}
              </span>
              Topics
            </div>

            <div className="h-10 w-px bg-white/30"></div>

            <div>
              <span className="block text-2xl font-semibold text-white">
                {completed.length}
              </span>
              Solved
            </div>
          </div>
        </div>

        {/* ================= LOADING ================= */}
        {loading && (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Loading Striver Sheet...</p>
            <p className="text-sm text-slate-400 mt-1">This happens only once</p>
          </div>
        )}

        {/* ================= ERROR ================= */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <p className="text-red-700 font-semibold mb-2">Failed to load sheet</p>
            <button
              onClick={fetchSheet}
              className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================= MAIN APP ================= */}
        {!loading && !error && (
          <>
            {/* CONTROL PANEL */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6 mb-8">

              <ProgressBar />

              <div className="my-6 h-px bg-slate-200"></div>

              <AddTopic />

              {/* SEARCH */}
              <div className="mt-6">
                <label className="text-sm font-medium text-slate-600 block mb-2">
                  Search questions
                </label>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search problem (Two Sum, Binary Search...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 pl-10 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />

                  <span className="absolute left-3 top-3 text-slate-400">🔍</span>

                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-700 text-lg"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* WORKSPACE */}
            <div className="bg-white rounded-3xl shadow-lg border border-slate-200 p-6">
              <TopicList search={search} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
