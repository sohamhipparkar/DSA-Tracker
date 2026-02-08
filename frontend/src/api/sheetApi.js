import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 5000,
});

/* -------- READ -------- */
export const getSheet = () => API.get("/sheet");

/* -------- CREATE -------- */
export const createTopic = (topic) => API.post("/topic", topic);

/* -------- DELETE -------- */
export const deleteTopicAPI = (id) => API.delete(`/topic/${id}`);

/* -------- UPDATE -------- */
export const updateTopic = (id, topic) => API.put(`/topic/${id}`, topic);
