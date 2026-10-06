import axios, { AxiosRequestHeaders } from "axios";

const Agent = axios.create({
  baseURL: "https://mohinsservice.com/",
});

Agent.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    "Content-Type": "multipart/form-data",
  } as AxiosRequestHeaders;
  return config;
});

Agent.interceptors.response.use(
  (response) => {
    return response;
  },
  (err) => {
    console.log(err);
    if (err.code === "ERR_NETWORK") {
      console.error("Please check your connection to server");
    }
    if (!err.response) {
      console.error("Please check your connection to server");
    }
    if (err.response?.status === 401) {
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

export const SendEmail = async (formData: FormData) => {
  return Agent.post("/api/msg/SendMail", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export default Agent;
