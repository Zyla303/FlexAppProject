import axios, { AxiosRequestConfig } from "axios";

const BASE_API_URL = "https://localhost:7117/api";

const XHR_DEFAULT = {
  baseURL: BASE_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
};

enum HttpRequestTypes {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Delete = "DELETE",
}

const buildConfig = (path: string, config: AxiosRequestConfig) => {
  return {
    ...XHR_DEFAULT,
    url: path,
    ...config,
  };
};

async function request(path = "", config: AxiosRequestConfig) {
  // console.log(buildConfig(path, config));

  const response = await axios.request(buildConfig(path, config));

  return response.data;
}

export async function get(path = "", config = {}) {
  return request(path, { ...config, method: HttpRequestTypes.Get });
}

export async function post(path = "", params = {}, config = {}) {
  return request(path, { params, method: HttpRequestTypes.Post, ...config });
}

export async function put(path = "", params = {}) {
  return request(path, { params, method: HttpRequestTypes.Put });
}

export async function httpDelete(path = "", data = {}) {
  return request(path, { data, method: HttpRequestTypes.Delete });
}
