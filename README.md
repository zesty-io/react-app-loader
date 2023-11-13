# React App Loader for Zesty.io Marketplace Apps

This `AppLoader` component is designed to streamline the initialization process for applications in the Zesty.io Marketplace, particularly those leveraging the `@zesty-io/app-sdk`. It manages the asynchronous loading of user sessions and handles token-based authentication, making the integration of custom applications with Zesty.io's manager-ui more efficient and robust.

## Features

- **Token-Based Authentication:** Seamlessly handles the authentication process using session tokens.
- **Single Sign-On (SSO) Support:** Offers SSO options (Google, Azure, GitHub) for user authentication.
- **Window Message Management:** Awaits a session token from a window message.
- **Contextual SDK Access:** Provides easy access to the SDK's functionalities through a React context.

## Usage

Wrap your application with the `AppLoader` component to ensure proper initialization and authentication handling.

```jsx
import { AppLoader } from "@zesty-io/react-app-loader";
import MyApp from "./path/to/MyApp";

export default function App() {
  return (
    <AppLoader authServiceUrl="YOUR_AUTH_SERVICE_URL">
      <MyComponent />
    </AppLoader>
  );
}
```

## Props

- authServiceUrl (required): The URL of the authentication service.
- authCookie (optional): The cookie key used for authentication.
- token (optional): An initial token for authentication.

## Contextual SDK Usage

Access SDK functionalities within your components using the useSDK hook.

```jsx
import { useSDK } from '@zesty-io/react-app-loader';

const MyComponent = () => {
  const { isAuthenticated, token, logout, request, messages } = useSDK();

  // Example usage
  useEffect(() => {
    request('/some/endpoint')
      .then((res) => {
        // Handle response
      })
      .catch((err) => {
        // Handle error
      }
  }, [])

  return (
    <button onClick={() => logout()}>logout</button>
  );
};
```

## Additional Notes

The component automatically handles token renewal and provides a logout function.
The SSO options will only appear if the ssoCookieKey is provided and no token is available.
