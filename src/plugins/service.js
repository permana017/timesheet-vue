import axios from "axios";
const baseUrl = import.meta.env.VITE_API_URL;

export const getApi = async (path) => {
  try {
    const { data } = await axios.get(`${baseUrl}${path}`);
    return data;
  } catch (error) {
    throw error;
  }
};
export const postApi = async (init) => {
  try {
    const { data } = await axios.post(`${baseUrl}${init.path}`, init.body);
    return data;
  } catch (error) {
    throw error;
  }
};
export const updateApi = async (init) => {
  try {
    const { data } = await axios.put(`${baseUrl}${init.path}`, init.body);
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteApi = async (path) => {
  try {
    const { data } = await axios.delete(`${baseUrl}${path}`);
    return data;
  } catch (error) {
    throw error;
  }
};
