import React, { useContext, useEffect } from "react";
import { AuthContext } from "../../context/auth-context";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

const Deconnexion = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  let userSession;
  if (localStorage.length != 0) {
    userSession = JSON.parse(localStorage.getItem("userSession"));
    console.log(userSession.userId);
  }

  const deconnect = () => {
    localStorage.removeItem("userSession");
    console.log("Utilisateur Déconnecté");
    auth.logout();
    setTimeout(() => {
      navigate("/sport/sports");
      window.location.reload();
    }, 2000);
  };

  useEffect(() => {
    deconnect();
  }, []);

  return (
    <div>
      <h1>Vous avez bien été déconnecté</h1>
    </div>
  );
};

export default Deconnexion;
