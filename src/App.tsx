import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/store";
import AppRoutes from "./routes";
import { ToastContainer } from "react-toastify";

const App: React.FC = () => {

  useEffect(() => {
    document.querySelectorAll('dx-license, dx-license-trigger').forEach((node) => {
      node.parentNode?.removeChild(node);
    });
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (
            node.nodeType === 1 &&
            (node instanceof Element) &&
            (node.matches('dx-license') || node.matches('dx-license-trigger'))
          ) {
            node.remove();
          }
        });
      });
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
        <ToastContainer 
          limit={2}
        />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
