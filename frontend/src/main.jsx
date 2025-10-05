import { StrictMode, useContext, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { DarkModeContextProvider, DarkModeContext } from "./context/darkModeContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthContextProvider } from "./context/authContext.jsx";

// ✅ React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const clientId = "1070560350809-h0ehpsvpadssobn4vrlqacr51j8gjlsl.apps.googleusercontent.com";

// ✅ Create a React Query client
const queryClient = new QueryClient();

const RootComponent = () => {
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    document.body.className = darkMode ? "theme-dark" : "theme-light";
  }, [darkMode]);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthContextProvider>
        <DarkModeContextProvider>
          {/* ✅ Wrap with QueryClientProvider for React Query */}
          <QueryClientProvider client={queryClient}>
            <RootComponent />
          </QueryClientProvider>
        </DarkModeContextProvider>
      </AuthContextProvider>
    </GoogleOAuthProvider>
  </StrictMode>
);
