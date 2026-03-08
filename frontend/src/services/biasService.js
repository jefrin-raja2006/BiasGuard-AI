import api from "./api";

export const analyzeBias = async (payload) => {
  const response = await api.post("/analyze-bias", payload);
  return response.data;
};