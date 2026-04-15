import axios, { AxiosError, AxiosResponse } from "axios";
import { baseUrl } from ".";

function getHeaderObject(
  contentType: string = "application/json",
  authToken: string | undefined = undefined,
) {
  let headers =
    typeof authToken == "string"
      ? {
          "Content-Type": contentType,
          Accept: "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      : {
          "Content-Type": "application/json",
          Accept: "application/json",
        };

  return headers;
}

async function runInterceptor(refreshAuthToken: () => Promise<string | null>) {
  let hasRetried = false;
  axios.interceptors.response.use(
    (value: AxiosResponse) => {
      return value;
    },
    async (error: AxiosError | any) => {
      let originalRequest = error.config;
      console.log(
        "request intercepted..",
        JSON.stringify(error.config, null, 2),
        error.response.status,
        originalRequest._retry,
      );
      if (error.response?.status === 401 && !hasRetried) {
        console.log(
          "status code",
          error.response?.status,
          "original request",
          originalRequest,
          "hasRetried variable",
          hasRetried,
        );
        hasRetried = true;
        const freshToken = await refreshAuthToken();
        if (freshToken) {
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    },
  );
}

export async function getData(
  endpoint: string,
  refreshFunc: () => Promise<string | null>,
  authToken: string | undefined,
) {
  await runInterceptor(refreshFunc);
  try {
    let res = await axios.get(`${baseUrl}${endpoint}`, {
      headers: getHeaderObject("application/json", authToken),
    });
    return { err: false, data: res };
  } catch (err: any) {
    return { err: true, error: err };
  }
}

export async function postData(
  endpoint: string,
  refreshFunc: () => Promise<string | null>,
  body: any,
  authToken: string | undefined = undefined,
  contentType: string = "application/json",
) {
  await runInterceptor(refreshFunc);
  try {
    let res = await axios.post(`${baseUrl}${endpoint}`, body, {
      headers: getHeaderObject(contentType, authToken),
    });
    return { err: false, data: res };
  } catch (err: any) {
    return { err: true, error: err };
  }
}

export async function patchData(
  endpoint: string,
  refreshFunc: () => Promise<string | null>,
  body: any,
  authToken: string | undefined,
  contentType: string = "application/json",
) {
  await runInterceptor(refreshFunc);
  try {
    let res = await axios.patch(`${baseUrl}${endpoint}`, body, {
      headers: getHeaderObject(contentType, authToken),
    });
    return { err: false, data: res };
  } catch (err: any) {
    return { err: true, error: err };
  }
}

export async function putData(
  endpoint: string,
  refreshFunc: () => Promise<string | null>,
  body: any,
  authToken: string | undefined,
  contentType: string = "application/json",
) {
  await runInterceptor(refreshFunc);
  try {
    let res = await axios.put(`${baseUrl}${endpoint}`, body, {
      headers: getHeaderObject(contentType, authToken),
    });
    return { err: false, data: res };
  } catch (err: any) {
    return { err: true, error: err };
  }
}
