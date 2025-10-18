import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const clientApi = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

export const serverApi = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

export { axios };
