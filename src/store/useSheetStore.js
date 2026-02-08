import { create } from "zustand";
import { v4 as uuid } from "uuid";

/* ---------------- LOAD SAVED DATA ---------------- */

const loadTopics = () => {
  const data = localStorage.getItem("sheet");
  return data ? JSON.parse(data) : [];
};

const loadCompleted = () => {
  const data = localStorage.getItem("completedQuestions");
  return data ? JSON.parse(data) : [];
};

export const useSheetStore = create((set, get) => ({
  /* ---------------- STATE ---------------- */

  topics: loadTopics(),
  completed: loadCompleted(),

  /* ---------------- API LOAD ---------------- */

  setTopicsFromAPI: (topicsData) =>
    set(() => {
      localStorage.setItem("sheet", JSON.stringify(topicsData));
      return { topics: topicsData };
    }),

  /* ---------------- PROGRESS TRACKER ---------------- */

  toggleComplete: (qId) =>
    set((state) => {
      let updated;

      if (state.completed.includes(qId)) {
        // uncheck
        updated = state.completed.filter((id) => id !== qId);
      } else {
        // check
        updated = [...state.completed, qId];
      }

      localStorage.setItem("completedQuestions", JSON.stringify(updated));
      return { completed: updated };
    }),

  /* ---------------- TOPIC ---------------- */

  addTopic: (title) =>
    set((state) => {
      const updated = [
        ...state.topics,
        {
          id: uuid(),
          title,
          subtopics: [],
        },
      ];

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  deleteTopic: (id) =>
    set((state) => {
      const updated = state.topics.filter((t) => t.id !== id);
      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  /* ----------- DRAG & DROP REORDER TOPICS ----------- */

  reorderTopics: (oldIndex, newIndex) =>
    set((state) => {
      const updated = [...state.topics];

      const [movedItem] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, movedItem);

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  /* ---------------- SUBTOPIC ---------------- */

  addSubtopic: (topicId, title) =>
    set((state) => {
      const updated = state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: [
                ...topic.subtopics,
                { id: uuid(), title, questions: [] },
              ],
            }
          : topic
      );

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  deleteSubtopic: (topicId, subId) =>
    set((state) => {
      const updated = state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.filter((s) => s.id !== subId),
            }
          : topic
      );

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  /* ---------------- QUESTION ---------------- */

  addQuestion: (topicId, subId, title, link) =>
    set((state) => {
      const updated = state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((sub) =>
                sub.id === subId
                  ? {
                      ...sub,
                      questions: [
                        ...sub.questions,
                        {
                          id: uuid(),
                          title,
                          link,
                        },
                      ],
                    }
                  : sub
              ),
            }
          : topic
      );

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  deleteQuestion: (topicId, subId, qId) =>
    set((state) => {
      const updated = state.topics.map((topic) =>
        topic.id === topicId
          ? {
              ...topic,
              subtopics: topic.subtopics.map((sub) =>
                sub.id === subId
                  ? {
                      ...sub,
                      questions: sub.questions.filter((q) => q.id !== qId),
                    }
                  : sub
              ),
            }
          : topic
      );

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  // -------- PROGRESS CALCULATION --------
  getProgress: () => {
    const { topics, completed } = get();

    // Safety check: ensure topics is an array
    if (!Array.isArray(topics)) {
      return { total: 0, done: 0, percent: 0 };
    }

    let total = 0;

    topics.forEach((topic) => {
      // Safety check: ensure subtopics exists and is an array
      if (Array.isArray(topic.subtopics)) {
        topic.subtopics.forEach((sub) => {
          // Safety check: ensure questions exists and is an array
          if (Array.isArray(sub.questions)) {
            total += sub.questions.length;
          }
        });
      }
    });

    const done = completed.length;

    const percent = total === 0 ? 0 : Math.round((done / total) * 100);

    return { total, done, percent };
  },
}));
