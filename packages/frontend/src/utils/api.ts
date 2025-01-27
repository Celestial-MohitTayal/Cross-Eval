import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const apiGet = async (endpoint: string, token: string) => {
  try {
    const response = await axios.get(`${apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`API Get Error: ${error}`);
  }
};

export const apiPost = async (endpoint: string, data: object, token: string) => {
  try {
    const response = await axios.post(`${apiUrl}/${endpoint}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`API Post Error: ${error}`);
  }
};

export const apiDelete = async (endpoint: string, token: string) => {
  try {
    const response = await axios.delete(`${apiUrl}/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`API Delete Error: ${error}`);
  }
};
