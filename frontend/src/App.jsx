import { useEffect, useState } from "react";
import { getSheet } from "./api/sheetApi";
import { useSheetStore } from "./store/useSheetStore";
import AddTopic from "./components/AddTopic";
import TopicList from "./components/TopicList";
import DarkModeToggle from "./components/DarkModeToggle";
import AdminToggle from "./components/AdminToggle";
import TutorialModal from "./components/Tutorial";
import { Analytics } from "@vercel/analytics/react";

export default function App() {
  const setTopicsFromAPI = useSheetStore((s) => s.setTopicsFromAPI);
  const topics = useSheetStore((s) => s.topics);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSheet = async () => {
      try {
        const res = await getSheet();

        console.log("API RESPONSE:", res.data);

        // SAFE extraction
        const questions = res?.data?.data?.questions || [];

        if (questions.length === 0) {
          console.warn("No questions found in dataset");
          setLoading(false);
          return;
        }

        // -------- GROUP QUESTIONS INTO TOPICS --------

        const topicMap = {};

        questions.forEach((q) => {
          const topicName = q.topic || "General";
          const subTopicName = q.subTopic || "Misc";

          if (!topicMap[topicName]) {
            topicMap[topicName] = {
              id: topicName,
              title: topicName,
              subtopics: {},
            };
          }

          if (!topicMap[topicName].subtopics[subTopicName]) {
            topicMap[topicName].subtopics[subTopicName] = {
              id: subTopicName,
              title: subTopicName,
              questions: [],
            };
          }

          topicMap[topicName].subtopics[subTopicName].questions.push({
            id: q._id,
            title: q.title || q.questionId?.name,
            link: q.questionId?.problemUrl || q.resource || "#",
          });
        });

        // convert to array
        const formattedTopics = Object.values(topicMap).map((topic) => ({
          ...topic,
          subtopics: Object.values(topic.subtopics),
        }));

        console.log("FORMATTED TOPICS:", formattedTopics);

        setTopicsFromAPI(formattedTopics);
        setLoading(false);
      } catch (err) {
        console.error("FRONTEND LOAD FAILED:", err);
        setLoading(false);
      }
    };

    loadSheet();
  }, []);

  // ---------- LOADING SCREEN ----------
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg text-slate-500">
        Loading Striver Sheet...
      </div>
    );
  }

  // ---------- MAIN UI ----------
  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-semibold tracking-tight">
          Strivers A2Z DSA Sheet
        </h1>
        
        <div className="flex items-center gap-3">
          <AdminToggle />
          <DarkModeToggle />
        </div>
      </div>

      <AddTopic />

      <input
        type="text"
        placeholder="🔍 Search questions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      />
      
      <br />

      <TopicList search={search} />
      <>
        <TutorialModal />
      </>
      <Analytics />
    </div>
  );
}
