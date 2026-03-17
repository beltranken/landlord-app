import { refresh as ApiRefresh } from "@/api";
import Loading from "@/components/atoms/loading/loading";
import { User } from "@/types";
import {
  getToken,
  removeToken,
  setMobileToken,
  setToken,
  setupInterceptors,
} from "@/utils/auth";
import { loginSignal, logoutSignal } from "@/utils/notification";
import { AuthData } from "@/validations";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface IAuthContext {
  isAuthenticated: boolean;
  authData?: AuthData;
  setAuthData: (data?: AuthData) => void;
  user?: User;
  isInitialized: boolean;
  /* signIn: (prop: LoginRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>; 
  exchange: (token: string) => Promise<void>;*/
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default function AuthProvider({
  children,
}: Readonly<React.PropsWithChildren>) {
  const [isInitialized, setIsInitialized] = useState(false);
  const interceptorsInstalledRef = useRef(false);
  const interceptorsCleanupRef = useRef<() => void>(() => {});
  const [user, setUser] = useState<User>();
  const [authData, setAuthData] = useState<AuthData>();

  /* const signIn = useCallback(
    async (body: LoginRequest) => {
      setIsLoading(true);
      try {
        const { data: responseData, error, config } = await ApiSignIn({ body });

        if (error) {
          console.error("Path: ", config?.baseURL);
          throw error;
        }

        if (responseData === undefined) {
          throw new Error("AuthData is undefined");
        }

        const { data } = responseData;

        setAuthData({ ...data, refreshToken: "" });

        await setMobileToken(data.refreshToken);

        loginSignal(data);
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [setAuthData, setIsLoading],
  );

  const signOut = useCallback(async () => {
    setIsLoading(true);
    try {
      await ApiSignOut();
      logoutSignal();
    } catch (e) {
      console.error(e);
    } finally {
      setAuthData(undefined);
      await removeToken("accessToken");
      await setMobileToken(undefined);
      setIsLoading(false);
    }
  }, [setIsLoading, setAuthData]); */

  const refresh = useCallback(async () => {
    const refreshToken = await getToken("refreshToken");
    const { data: responseData } = await ApiRefresh({
      body: { refreshToken: refreshToken ?? undefined },
    });

    const data = responseData?.data;

    if (!data) {
      removeToken("accessToken");
      await setMobileToken(undefined);
    } else {
      setToken("accessToken", data.token);
      await setMobileToken(data.refreshToken);
    }
  }, [setAuthData]);

  const exchange = useCallback(
    async (token: string) => {
      // TODO: implement exchange endpoint and use it here
      console.log("Exchange token: ", token);
      /* const { data } = await ApiExchange({
        body: { code: token },
      });
      setAuthData(data);
      await setMobileToken(data?.refreshToken); */
    },
    [setAuthData],
  );

  useEffect(() => {
    if (!interceptorsInstalledRef.current) {
      const { cleanUp } = setupInterceptors(setAuthData);
      interceptorsCleanupRef.current = cleanUp;
      interceptorsInstalledRef.current = true;
    }
  }, [setAuthData]);

  const handleSetAuthData = async (data?: AuthData) => {
    if (data) {
      setToken("accessToken", data.token);
      setAuthData({ ...data, refreshToken: "" });
      loginSignal(data);
      await setMobileToken(data.refreshToken);
    } else {
      setAuthData(undefined);
      removeToken("accessToken");
      logoutSignal();
      await setMobileToken(undefined);
    }

    await setMobileToken(data?.refreshToken);
  };

  // Initial refresh
  useEffect(() => {
    if (!isInitialized) {
      // TODO: check if access token is already present and valid before calling refresh

      refresh()
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          setIsInitialized(true);
        });
    }
  }, [refresh, isInitialized]);

  useEffect(
    () => () => {
      interceptorsCleanupRef.current();
    },
    [],
  );

  const value = useMemo<IAuthContext>(
    () => ({
      isAuthenticated: !!authData,
      isInitialized,
      user,
      setAuthData: handleSetAuthData,
    }),
    [isInitialized, user],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <Loading visible={!isInitialized} />
    </AuthContext.Provider>
  );
}
