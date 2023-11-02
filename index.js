import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import SDK from "@zesty-io/app-sdk";
import Cookies from "js-cookie";
import { SSOButton, SSOButtonGroup, theme } from "@zesty-io/material";

const cookieEnvMap = {
  development: "DEV_APP_SID",
  stage: "STAGE_APP_SID",
  production: "APP_SID",
};

const authApiEnvMap = {
  development: "https://auth.api.dev.zesty.io",
  stage: "https://auth.api.stage.zesty.io",
  production: "https://auth.api.stage.zesty.io",
};

const isInIframe = window.self !== window.top;

export function AppLoader(props) {
  const [token, setToken] = useState(
    props.token || Cookies.get(cookieEnvMap[props.env || "production"]) || ""
  );
  const [instance, setInstance] = useState(props.instance || {});

  useEffect(() => {
    // Initialize the SDK if we are in an iframe and no token is present to wait for postMessage
    if (isInIframe && !token) {
      SDK.init(token, instance).then((json) => {
        setInstance(json.instance);
        setToken(json.token);
      });
    }
  }, []);

  // Show loading state if it is an iframe and no token is present while we wait for postMessage
  if (!token && isInIframe) {
    return (
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
    );
  }

  // Show SSO buttons if no token is present
  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <SSOButtonGroup
          authServiceUrl={authApiEnvMap[props.env || "production"]}
          onSuccess={() => {
            setToken(Cookies.get(cookieEnvMap[props.env || "production"]));
          }}
          onError={() => console.log("error")}
        >
          <SSOButton service="google" />
          <SSOButton service="azure" />
          <SSOButton service="github" />
        </SSOButtonGroup>
        ;
      </ThemeProvider>
    );
  }

  return props.children;
}
