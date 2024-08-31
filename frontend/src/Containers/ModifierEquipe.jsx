import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/auth-context";
import { useHttpClient } from "../hooks/http-hook";
import ModalMessageErreur from "../components/UIElements/ModalMessageErreur";
import Spinner from "../components/UIElements/LoadingSpinner";

const ModifierEquipe = ({ Id }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formData, setFormData] = useState({
    nomEquipe: "",
    imageUrl: "",
    sport: "",
  });
  const [equipes, setEquipes] = useState([]);
  const [selectedEquipeNom, setSelectedEquipeNom] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}equipes`
        );
        setEquipes(responseData.equipes);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des équipes :",
          error.message
        );
      }
    };

    fetchEquipes();
  }, [sendRequest]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedEquipeNom(value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const updateUrl = `http://localhost:5000/api/equipes/${selectedEquipeNom}`;
      const response = await sendRequest(
        updateUrl,
        "PATCH",
        JSON.stringify(formData),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );

      console.log("Équipe modifiée :", response);
    } catch (error) {
      console.error(
        "Erreur lors de la modification de l'équipe :",
        error.message
      );
      setErrorMessage(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Modifier l'équipe</h2>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur
          message={error || errorMessage}
          onClose={clearError}
        />
      </div>

      <div className="control">
        <label htmlFor="nomEquipe">Nom de l'équipe</label>
        <select
          id="nomEquipe"
          name="nomEquipe"
          value={selectedEquipeNom}
          onChange={handleInputChange}
        >
          <option value="">Sélectionnez une équipe</option>
          {equipes.map((equipe) => (
            <option key={equipe.id} value={equipe.nomEquipe}>
              {equipe.nomEquipe}
            </option>
          ))}
        </select>
      </div>

      <p className="form-actions">
        <button type="reset" className="button button-flat">
          Réinitialiser
        </button>
        <button type="submit" className="button">
          Modifier
        </button>
      </p>
    </form>
  );
};

export default ModifierEquipe;
