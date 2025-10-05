import { createBrowserRouter, RouterProvider, Navigate, Outlet } from "react-router-dom";
import Login from "./pages/login/Login";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import Groups from "./pages/groups/Groups";
import Friends from "./pages/friends/Friends";
import Settings from "./pages/settings/Settings";
import Events from "./pages/events/Events";
import HallOfFame from "./pages/hallOfFame/HallOfFame";
import AlumniMap from "./pages/alumniMap/AlumniMap";
import HatDedication from "./pages/hatDedication/HatDedication";
import Marketplace from "./pages/marketplace/Marketplace";
import MoreInfo from "./pages/marketplace/MoreInfo";
import Sell from "./pages/marketplace/Sell";
import AboutTeam from "./pages/aboutTeam/AboutTeam.jsx";
import OwnProfile from "./pages/ownProfile/OwnProfile";
import Chats from "./pages/chats/Chats";
import "./style.scss";
import { useContext, useEffect } from "react";
import { DarkModeContext } from "./context/darkModeContext.jsx";


function App() {
  const currentUser = true; // TODO: Replace with real auth state
  const { darkMode } = useContext(DarkModeContext);

  useEffect(() => {
    console.log("Dark Mode:", darkMode);
  }, [darkMode]);

  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{ display: "flex" }}>
          <LeftBar />
          <div style={{ flex: 6 }}>
            <Outlet />
          </div>
          <RightBar />
        </div>
      </div>
    );
  };

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
        { path: "/groups", element: <Groups /> },
        { path: "/friends", element: <Friends /> },
        { path: "/settings", element: <Settings /> },
        { path: "/events", element: <Events /> },
        { path: "/hallOfFame", element: <HallOfFame /> },
        { path: "/alumniMap", element: <AlumniMap /> },
        { path: "/aboutTeam", element: <AboutTeam /> },
        { path: "/chats", element: <Chats /> },
        { path: "/marketplace", element: <Marketplace /> },
        { path: "/marketplace/item/:id", element: <MoreInfo /> },
        { path: "/marketplace/sell", element: <Sell /> },
        { path: "/hatDedication", element: <HatDedication /> },
        { path: "/ownProfile/:id", element: <OwnProfile /> },
        // ❌ Removed Register route — handled in Login.jsx as a popup
      ],
    },
    { path: "/login", element: <Login /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
