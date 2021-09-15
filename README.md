# react-app-loader
> React functional component which orchestrates the @zesty-io/app-sdk initialization

Zesty.io custom apps are loaded by the [manager-ui](https://github.com/zesty-io/manager-ui) which passes the users session token to the custom application once it has completed loading in an iframe. This occurs asynchronously and therefore the mounting of the custom app, which depends on this token, must be delayed until ready.

> NOTE: The component will display a loading screen while waiting for the session token.

This component solves this for you and now loading your app becomes as simple as;

```React
import { AppLoader } from '@zesty-io/react-app-loader';
import MyApp from "./path/to/MyApp";

export default function App() {
  return (
      <AppLoader>
        <MyApp />
      </AppLoader>
  );
}
```