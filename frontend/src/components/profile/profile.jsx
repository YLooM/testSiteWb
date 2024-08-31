import React, { useState } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();

    setShowAddModal(false);
    setShowRemoveModal(false);
    setShowModifyModal(false);
  }

  /*Changement de nom et de photo de profile*/
  const [imageUrl, setImageUrl] = useState("");
  const [nouvNomUtilisateur, setNouvNomUtilisateur] = useState("");
  const [nvCouriel, setCourriel] = useState("");
  const [nvMdp, setMdp] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const userSession = JSON.parse(localStorage.getItem("userSession"));
    console.log(userSession.userId);
    fetch(`${process.env.REACT_APP_BACKEND_URL}users/${userSession.userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: nouvNomUtilisateur || userSession.name,
        image: imageUrl || userSession.image,
        password: nvMdp || userSession.password,
        courriel: nvCouriel || userSession.courriel,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigate("/");
      })
      .catch((error) => {
        console.error(
          "Erreur lors de la modification de l'utilisateur:",
          error
        );
      });
  }
  return (
    <React.Fragment>
      {/* Formulaire de base */}
      <form onSubmit={handleSubmit} className="formProfile">
        <h2> 🧰 Paramètre du profil Laval Sport 🛠</h2>
        <h3>
          {" "}
          Cette section vous permettra de changer quelques paramètres de votre
          profil.
        </h3>
        <p></p>
        <div className="control">
          <label htmlFor="userName">Nouveau non utilisateur</label>
          <input
            id="userName"
            type="userName"
            name="userName"
            value={nouvNomUtilisateur}
            onChange={(event) => setNouvNomUtilisateur(event.target.value)}
          />
        </div>

        <div className="control">
          <label htmlFor="email">Nouvelle Adresse Courriel</label>
          <input
            id="newEmail"
            type="email"
            name="NewEmail"
            value={nvCouriel}
            onChange={(event) => setCourriel(event.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="password">mot de passe</label>
          <input
            id="motDePasse"
            type="password"
            name="motDePasse"
            value={nvMdp}
            onChange={(event) => setMdp(event.target.value)}
          />
        </div>
        <div className="control">
          <label htmlFor="imgProfile">
            Lien pour la nouvelle photo de profil
          </label>
          <input
            id="imgProfile"
            type="img"
            name="imgProfile"
            value={imageUrl}
            onChange={(event) => setImageUrl(event.target.value)}
          />
        </div>
        <hr />
        <p className="form-actions">
          <button type="submit" className="button">
            Enregistrer les modifications
          </button>
        </p>
      </form>

      {/* Formulaire pour gérer les equipe*/}
      <form className="formJeu">
        <div className="gererJeu">
          <h2> 🔧 Gerer mes favoris 🔧</h2>
        </div>
        <p>
          <NavLink to="/EquipesFavorites" className="button-gerer lien">
            Mes Équipes Favorites
          </NavLink>
        </p>
      </form>
    </React.Fragment>
  );
}
