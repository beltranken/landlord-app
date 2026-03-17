import { refresh } from "@/api";
import { client } from "@/api/client.gen";
import { AuthData } from "@/validations";
import { InternalAxiosRequestConfig } from "axios";
import { getToken } from "./get-token";
import { setMobileToken } from "./set-mobile-token";

export default function setupInterceptors(
  setAuthData: (token?: AuthData) => void,
) {
  let isRefreshing = false;
  let failedQueue: {
    resolve: (valu: unknown) => void;
    reject: (err: unknown) => void;
    config: any;
  }[] = [];

  const attachedTokenFn = async (config: InternalAxiosRequestConfig) => {
    const isAuth = config.url?.startsWith("/auth") === false;
    const hasToken = !config.headers.Authorization;
    const accessToken = await getToken("accessToken");

    if (isAuth && hasToken && accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  };

  const onFulfilled = (response: any) => response;
  const onRejected = async (error: any) => {
    const originalRequest = error.config;

    const isSigningIn = error.config?.url === "/auth/sign-in";

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isSigningIn
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve,
            reject,
            config: originalRequest,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getToken("refreshToken");
        const { data: responseData, error } = await refresh({
          body: { refreshToken: refreshToken ?? undefined },
        });
        if (responseData === undefined || error) {
          throw new Error("AuthData is undefined");
        }
        const data = responseData.data;

        setMobileToken(data?.refreshToken).catch((e) => {
          console.error(e);
        });
        setAuthData(data);

        failedQueue.forEach(({ config, resolve, reject }) => {
          config.headers.Authorization = `Bearer ${data.token}`;
          client
            .instance(config)
            .then((response) => resolve(response))
            .catch((err) => reject(err));
        });

        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return client.instance(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed, logging out");
        setAuthData(undefined);
        await setMobileToken();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        failedQueue = [];
      }
    }

    return Promise.reject(error);
  };

  const attachedToken =
    client.instance.interceptors.request.use(attachedTokenFn);

  const refreshToken = client.instance.interceptors.response.use(
    onFulfilled,
    onRejected,
  );

  return {
    attachedTokenFn,
    onFulfilled,
    onRejected,
    cleanUp: () => {
      client.instance.interceptors.request.eject(attachedToken);
      client.instance.interceptors.response.eject(refreshToken);
    },
  };
}
