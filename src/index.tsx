import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import SDK from "@zesty-io/app-sdk";
import {
  Box,
  CircularProgress,
  Typography,
  ThemeProvider,
} from "@mui/material";
import { SSOButton, SSOButtonGroup, theme } from "@zesty-io/material";
import Cookies from "js-cookie";

interface AppLoaderContextType {
  token: string;
  isAuthenticated: boolean;
  logout: () => void;
  request: (url: string, opts?: RequestInit) => Promise<unknown>;
  messages: MessageEvent[];
}

const AppLoaderContext = createContext<AppLoaderContextType>({
  token: "",
  isAuthenticated: false,
  logout: () => {},
  request: async () => {},
  messages: [],
});

interface AppLoaderProps {
  children: ReactNode;
  authServiceUrl: string;
  token?: string;
  authCookie?: string;
}

export const AppLoader = ({
  children,
  authServiceUrl,
  token,
  authCookie,
}: AppLoaderProps) => {
  const [tokenState, setTokenState] = useState(
    token || Cookies.get(authCookie || "") || ""
  );
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState<MessageEvent[]>([]);

  const shouldShowSSO = authCookie && !tokenState;

  useEffect(() => {
    setIsAuthenticating(true);
    SDK.setMessageReceivedCallback((newMessages: MessageEvent[]) => {
      setMessages([...newMessages]);
    });
    SDK.init(authServiceUrl, tokenState)
      .then((response: any) => {
        setTokenState(response.token);
        setIsAuthenticated(true);
        SDK.startTokenKeepAlive();
      })
      .catch((error: any) => {
        console.error("SDK Initialization Error:", error);
        setTokenState("");
      })
      .finally(() => {
        setIsAuthenticating(false);
      });
    return () => {
      SDK.stopTokenKeepAlive();
    };
  }, [authServiceUrl, tokenState, authCookie]);

  const logout = () => {
    SDK.logout().then(() => {
      setTokenState("");
      setIsAuthenticated(false);
    });
  };

  // Context value
  const value = {
    token: tokenState,
    isAuthenticated,
    logout,
    request: SDK.request,
    messages,
  };

  if (isAuthenticating) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h6" component="div" gutterBottom>
            Starting Application...
          </Typography>
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  if (shouldShowSSO) {
    return (
      <ThemeProvider theme={theme}>
        <SSOButtonGroup
          authServiceUrl={authServiceUrl}
          onSuccess={() => {
            setTokenState(Cookies.get(authCookie) || "");
          }}
          onError={() => console.error("SSO Error")}
        >
          <SSOButton service="google" />
          <SSOButton service="azure" />
          <SSOButton service="github" />
        </SSOButtonGroup>
      </ThemeProvider>
    );
  }

  return isAuthenticated ? (
    <AppLoaderContext.Provider value={value}>
      {children}
    </AppLoaderContext.Provider>
  ) : null;
};

export const useSDK = () => {
  const context = useContext(AppLoaderContext);
  if (context === undefined) {
    throw new Error("useSDK must be used within the AppLoader");
  }
  return context;
};
