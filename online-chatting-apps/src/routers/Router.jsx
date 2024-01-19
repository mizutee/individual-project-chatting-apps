import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ChatRoom from "../pages/dashboard";
// import LoginPage from "../pages/login";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <ChatRoom />,
  },
]);


export default router
