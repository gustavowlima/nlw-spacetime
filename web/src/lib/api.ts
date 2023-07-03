import axios from "axios";

export const api = axios.create({
  baseURL: "https://spacetime-backend-na3x.onrender.com",
});
