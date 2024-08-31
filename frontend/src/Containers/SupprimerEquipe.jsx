import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

const SupprimerEquipe = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [nomEquipe, setNomEquipe] = useState("");

  // Définition de la fonction onDelete
  const onDelete = async (nomEquipe) => {
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}equipes/${nomEquipe}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );

      console.log("Équipe supprimée avec succès :", response);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'équipe :",
        error.message
      );
    }
  };

  const handleInputChange = (event) => {
    setNomEquipe(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Appel de la fonction onDelete avec le nom de l'équipe à supprimer
    onDelete(nomEquipe);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Supprimer une Équipe</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={clearError} />
      </div>

      <div className="control">
        <label htmlFor="nomEquipe">Nom de l'Équipe</label>
        <input
          id="nomEquipe"
          type="text"
          value={nomEquipe}
          onChange={handleInputChange}
        />
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Réinitialiser
        </button>
        <button type="submit" className="button">
          Supprimer
        </button>
      </p>
    </form>
  );
};

export default SupprimerEquipe;
