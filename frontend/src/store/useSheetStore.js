import { create } from "zustand";
import { v4 as uuid } from "uuid";

/* ---------- LOCAL STORAGE LOADERS ---------- */

const loadTopics = () => {
  try {
    const data = localStorage.getItem("sheet");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const loadCompleted = () => {
  try {
    const data = localStorage.getItem("completedQuestions");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

/* ⭐ ADMIN MODE DEFAULT ON (FIRST VISIT) */
const loadAdmin = () => {
  const saved = localStorage.getItem("adminMode");

  // First visit → automatically enable admin
  if (saved === null) {
    localStorage.setItem("adminMode", "true");
    return true;
  }

  return saved === "true";
};

/* ---------- STORE ---------- */

export const useSheetStore = create((set, get) => ({
  /* ===== STATE ===== */

  topics: loadTopics(),
  completed: loadCompleted(),
  isAdmin: loadAdmin(),

  /* ===== ADMIN MODE ===== */

  toggleAdminMode: () =>
    set((state) => {
      const newMode = !state.isAdmin;
      localStorage.setItem("adminMode", newMode);
      return { isAdmin: newMode };
    }),

  /* ===== HYDRATE FROM API ===== */

  setTopicsFromAPI: (topicsData) => {
    localStorage.setItem("sheet", JSON.stringify(topicsData));
    set({ topics: topicsData });
  },

  /* ===== PROGRESS CHECKBOX ===== */

  toggleComplete: (qId) =>
    set((state) => {
      let updated;

      if (state.completed.includes(qId)) {
        updated = state.completed.filter((id) => id !== qId);
      } else {
        updated = [...state.completed, qId];
      }

      localStorage.setItem("completedQuestions", JSON.stringify(updated));
      return { completed: updated };
    }),

  /* ===== TOPIC ===== */

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

  /* ===== REORDER ===== */

  reorderTopics: (oldIndex, newIndex) =>
    set((state) => {
      const updated = [...state.topics];
      const [moved] = updated.splice(oldIndex, 1);
      updated.splice(newIndex, 0, moved);

      localStorage.setItem("sheet", JSON.stringify(updated));
      return { topics: updated };
    }),

  /* ===== SUBTOPIC ===== */

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

  /* ===== QUESTIONS ===== */

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
                        { id: uuid(), title, link },
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
}));
