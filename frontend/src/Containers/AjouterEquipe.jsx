import React, { useContext, useState } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

const NouvelleEquipe = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formData, setFormData] = useState({
    nomEquipe: "",
    imageUrl: "",
    sport: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}equipes`,
        "POST",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      setFormData({
        nomEquipe: "",
        imageUrl: "",
        sport: "",
      });

      console.log("Nouvelle équipe ajoutée :", response);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'équipe :", error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Nouvelle Équipe</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={clearError} />
      </div>

      <div className="control">
        <label htmlFor="nomEquipe">Nom de l'Équipe</label>
        <input
          id="nomEquipe"
          type="text"
          name="nomEquipe"
          value={formData.nomEquipe}
          onChange={handleInputChange}
        />
      </div>
      <div className="control">
        <label htmlFor="imageUrl">URL de l'Image</label>
        <input
          id="imageUrl"
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleInputChange}
        />
      </div>
      <div className="control">
        <label htmlFor="sport">Type de Sports</label>
        <input
          id="sport"
          type="text"
          name="sport"
          value={formData.sport}
          onChange={handleInputChange}
        />
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Réinitialiser
        </button>
        <button type="submit" className="button">
          Ajouter
        </button>
      </p>
    </form>
  );
};

export default NouvelleEquipe;
