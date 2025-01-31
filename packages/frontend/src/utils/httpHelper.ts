import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const get = async (url: string, token: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error fetching data");
  }
};

const post = async (url: string, data: any, token: string) => {
  try {
    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error creating data");
  }
};

const put = async (url: string, data: any, token: string) => {
  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error updating data");
  }
};

const del = async (url: string, token: string) => {
  try {
    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.message || "Error deleting data");
  }
};

export { get, post, put, del };
