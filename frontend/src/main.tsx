import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import store  from "./store.ts";
import { Provider } from 'react-redux'

import { ThemeProvider } from "@/components/theme-provider";
createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
  </Provider>
);
