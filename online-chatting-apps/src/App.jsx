import "./App.css";
import "./index.css";
import ChatRoom from "./pages/dashboard";
import LoginPage from "./pages/login"

import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([


  {
    path: "/login",
    element: <LoginPage />,
    loader: () => {
      if(localStorage.getItem("access_token")) {
        return redirect('/')
      }
      return null
    }
  },

  {
    path: "/",
    element: <ChatRoom />,
    loader: () => {
      if(!localStorage.getItem("access_token")) {
        return redirect("/login")
      }
      return null;
    }
  }


]);

function App() {
  return (
    <>
    <RouterProvider router={router} />
    </>
  );
}

export default App;
