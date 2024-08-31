import React, { useState, useContext, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";

const NavLinks = (props) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  console.log(localStorage);

  useEffect(() => {
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    if (userSession) {
      auth.login(userSession.userId, userSession.token, userSession.admin);
    } else {
      navigate("/");
    }
  }, [auth]);
  const [sousMenuStates, setSousMenuStates] = useState({
    sport: false,
  });

  const handleSousMenuOpen = (menuName) => {
    setSousMenuStates({
      [menuName]: true,
    });
  };

  const handleSousMenuClose = (menuName) => {
    setSousMenuStates({
      ...sousMenuStates,
      [menuName]: false,
    });
  };

  console.log("test navlink", auth.admin);
  return (
    <ul className="nav-links">
      <li
        onMouseEnter={() => handleSousMenuOpen("sport")}
        onMouseLeave={() => handleSousMenuClose("sport")}
      >
        <NavLink to="./sport/sports">SPORT</NavLink>
        {sousMenuStates["sport"] && (
          <ul
            className="sub-menu"
            onMouseEnter={() => handleSousMenuOpen("sport")}
            onMouseLeave={() => handleSousMenuClose("sport")}
          >
            <li>
              <NavLink to="/sport/soccer">Soccer</NavLink>
            </li>
            <li>
              <NavLink to="/sport/baseball">Baseball</NavLink>
            </li>
            <li>
              <NavLink to="/sport/basketball">Basketball</NavLink>
            </li>
          </ul>
        )}
      </li>
      {auth.admin && (
        <li>
          <NavLink to="/">ALL USERS</NavLink>
        </li>
      )}

      {auth.isLoggedIn && (
        <li>
          <NavLink to="/u1/tasks">MES ÉQUIPES</NavLink>
        </li>
      )}

      {auth.admin && (
        <>
          <li>
            <NavLink to="/tasks/new">AJOUTER UNE ÉQUIPE</NavLink>
          </li>
          <li>
            <NavLink to="/SupprimerEquipe">SUPPRIMER UNE ÉQUIPE</NavLink>
          </li>
          <li>
            <NavLink to="/ModifierEquipe">MODIFIER UNE ÉQUIPE</NavLink>
          </li>
        </>
      )}

      <li>
        <NavLink to="/auth">CONNEXION</NavLink>
      </li>

      {/* Lien vers le profil */}
      {auth.isLoggedIn && (
        <li
          onMouseEnter={() => handleSousMenuOpen("profile")}
          onMouseLeave={() => handleSousMenuClose("profile")}
        >
          <NavLink to="/profile">PROFIL</NavLink>

          {sousMenuStates["profile"] && (
            <ul
              className="sub-menu"
              onMouseEnter={() => handleSousMenuOpen("profile")}
              onMouseLeave={() => handleSousMenuClose("profile")}
            >
              <li>
                <NavLink to="/deconnexion/deconnexion">déconnexion</NavLink>
              </li>
            </ul>
          )}
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
