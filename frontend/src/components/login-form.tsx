import { GoogleOAuthProvider } from "@react-oauth/google";

import GoogleLogin from "./GoogleLogin";

export function LoginForm() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
      <GoogleLogin />
    </GoogleOAuthProvider>
  );
}
