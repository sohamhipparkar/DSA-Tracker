import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 10000,
});

export const getSheet = () => API.get("/sheet");

export const createTopic = (topic) => API.post("/topic", topic);

export const deleteTopicAPI = (id) => API.delete(`/topic/${id}`);

export const updateTopic = (id, topic) => API.put(`/topic/${id}`, topic);
