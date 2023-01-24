import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_TEST_VAR,
});

export default api;
