import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useState, useCallback } from "react";
import Users from "../Containers/Users";
import UserEquipes from "../Containers/UserEquipes";
import RootLayout from "../Containers/Roots";
import ErrorPage from "../Containers/ErrorPage";
import NouvelleEquipe from "../Containers/AjouterEquipe";
import SupprimerEquipe from "../Containers/SupprimerEquipe";
import Auth from "../Containers/Auth";
import Subscribe from "../Containers/Subscribe";
import EquipesFavorites from "../Containers/EquipesFavorites";
import { AuthContext } from "../context/auth-context";
import Profile from "./profile/profile";
import SoccerPage from "./sport/soccer";
import BaseballPage from "./sport/baseball";
import BasketballPage from "./sport/basketball";
import Sports from "./sport/sports";
import Deconnexion from "./deconnexion/deconnexion";
import ModifierEquipe from "../Containers/ModifierEquipe";
import MesEquipes from "../components/gestionEquipe/mesEquipes";
import { userEquipesPath } from "../components/gestionEquipe/mesEquipes";

const routerLogin = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Users /> },
      { path: "users", element: <Users /> },
      { path: ":userId/tasks", element: <UserEquipes /> },
      { path: "/tasks/new", element: <NouvelleEquipe /> },
      { path: "/SupprimerEquipe", element: <SupprimerEquipe /> },
      { path: "/ModifierEquipe", element: <ModifierEquipe /> },
      { path: "/EquipesFavorites", element: <EquipesFavorites /> },
      { path: userEquipesPath, element: <MesEquipes /> },
      { path: "/sport/soccer", element: <SoccerPage /> },
      { path: "/sport/baseball", element: <BaseballPage /> },
      { path: "/sport/basketball", element: <BasketballPage /> },
      { path: "/sport/sports", element: <Sports /> },
      { path: "/auth", element: <Navigate to="/sport/sports" replace /> },
      { path: "/subscribe", element: <Navigate to="/sport/sports" replace /> },
      { path: "/deconnexion/deconnexion", element: <Deconnexion /> },
      { path: "/Profile", element: <Profile /> },
    ],
  },
]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Sports /> },
      { path: "/auth", element: <Auth /> },
      { path: "/subscribe", element: <Subscribe /> },
      { path: "/tasks/new", element: <NouvelleEquipe /> },
      { path: userEquipesPath, element: <MesEquipes /> },
      { path: "/sport/soccer", element: <SoccerPage /> },
      { path: "/sport/baseball", element: <BaseballPage /> },
      { path: "/sport/basketball", element: <BasketballPage /> },
      { path: "/sport/sports", element: <Sports /> },
      { path: "/deconnexion/deconnexion", element: <Deconnexion /> },
      { path: "/Profile", element: <Profile /> },
    ],
  },
]);

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(false);
  const [admin, setAdmin] = useState(null);

  const login = useCallback((uid, token, admin) => {
    setToken(token);
    setUserId(uid);
    setAdmin(admin);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setAdmin(null);
  }, []);

  if (!!token) {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          admin: admin,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={routerLogin} />
      </AuthContext.Provider>
    );
  } else {
    return (
      <AuthContext.Provider
        value={{
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          admin: admin,
          login: login,
          logout: logout,
        }}
      >
        <RouterProvider router={router} />
      </AuthContext.Provider>
    );
  }
};

export default App;
