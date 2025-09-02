import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { useAuthStore } from "./hooks/use-auth";
// import type { UserModel } from "./models/UserModel";
import { AdminDashboard } from "./pages/admin/AdminDashBoardPage";
import LoginPage from "./pages/LoginPage";
import { Provider } from "react-redux";
import store from "./store";
import WaiterDashBoard from "./pages/user/WaiterDashBoard";
import UserLayout from "./pages/user/UserLayout";
import TableLogs from "./pages/user/TableLogs";

function App() {
  const router = createBrowserRouter([
    { path: "/", element: <LoginPage /> },
    { path: "/admin", element: <AdminDashboard /> },
    {
      path: "/user",
      element: <UserLayout />,
      children: [
        { index: true, element: <WaiterDashBoard /> },
        { path: "log", element: <TableLogs /> },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>;
    </Provider>
  );
}

export default App;
