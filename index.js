import React, { useEffect, useState } from "react";

import SDK from "@zesty-io/app-sdk";

const bar = {
  animation: "ZestyAppLoaderFade 1s infinite ease-in-out",
  backgroundColor: "#5b667d",
  margin: "0.5rem",
  opacity: "1",
  width: "1rem",
};

export function AppLoader(props) {
  const [token, setToken] = useState(props.token || "");
  const [instance, setInstance] = useState(props.instance || {});

  useEffect(() => {
    // Pass token on init if provided, otherwise
    // sdk will listen for token from parent window
    SDK.init(token, instance).then((json) => {
      setInstance(json.instance);
      setToken(json.token);
    });
  }, []);

  useEffect(() => {
    var style = document.createElement("style");
    style.textContent = `  @keyframes ZestyAppLoaderFade {
            0%,
            80%,
            100% {
              opacity: 1;
            }
            40% {
              opacity: 0.3;
            }
          } `;
    document.body.appendChild(style);

    // TODO should we cleanup this style element when this component unmounts?
  }, []);

  return token && instance.ZUID
    ? React.cloneElement(props.children, {
        SDK,
        token,
        instance,
      })
    : /*#__PURE__*/
      React.createElement(
        "section",
        {
          style: {
            backgroundColor: "#f2f7fc",
            height: props.height || "100%",
            width: props.width || "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          },
        },
        /*#__PURE__*/ React.createElement(
          "h3",
          {
            style: {
              color: "#5b667d",
              fontSize: "32px",
              fontFamily: "Mulish, Arial, Sans-Serif",
              fontWeight: "300",
              lineHeight: "48px",
              letterSpacing: "0.32px",
            },
          },
          props.message || "Starting Application"
        ),
        /*#__PURE__*/ React.createElement(
          "div",
          {
            style: {
              display: "flex",
              height: "2rem",
            },
          },
          /*#__PURE__*/ React.createElement("span", {
            style: { ...bar, animationDelay: "-0.16s" },
          }),
          /*#__PURE__*/ React.createElement("span", {
            style: { ...bar, animationDelay: "1s" },
          }),
          /*#__PURE__*/ React.createElement("span", {
            style: { ...bar, animationDelay: "-0.32s" },
          }),
          /*#__PURE__*/ React.createElement("span", {
            style: { ...bar, animationDelay: "2s" },
          }),
          /*#__PURE__*/ React.createElement("span", {
            style: { ...bar, animationDelay: "-0.16s" },
          })
        )
      );
}
