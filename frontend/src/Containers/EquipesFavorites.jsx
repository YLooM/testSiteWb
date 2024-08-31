import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const EquipesFavorites = () => {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [sport, setSport] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [equipes, setEquipes] = useState([]);
  const [mesEquipes, setMesEquipes] = useState([]);

  useEffect(() => {
    const fetchEquipes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}equipes`
        );
        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors du chargement des équipes."
          );
        }
        const data = await response.json();
        setEquipes(data.equipes);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipes :", error);
      }
    };

    fetchEquipes();
  }, []);

  const sportsList = ["Tous les sports", "Soccer", "Baseball", "Basketball"];

  const filteredEquipes = equipes.filter((equipe) => {
    const equipeSportLowerCase = equipe.sport ? equipe.sport.toLowerCase() : "";
    const selectedSportLowerCase = sport ? sport.toLowerCase() : "";

    return (
      (selectedSportLowerCase === "tous les sports" ||
        equipeSportLowerCase === selectedSportLowerCase) &&
      equipe.nomEquipe.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSportChange = (selectedSport) => {
    setSport(selectedSport);
  };

  const handleAddToMesEquipes = () => {
    if (selectedTeam) {
      // Ajouter l'équipe sélectionnée à la liste mesEquipes
      setMesEquipes([...mesEquipes, selectedTeam]);
      setSelectedTeam("");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleAddToMesEquipes();
  };

  return (
    <div className="equipeContainer">
      <form onSubmit={handleSubmit}>
        <h2 style={{ display: "flex", justifyContent: "center" }}>
          Mes équipes favorites
        </h2>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <select
            id="selectEquipe"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            size={10}
          >
            <option value="">
              -- Sélectionnez pour ajouter ou supprimer de vos favoris --
            </option>
            {filteredEquipes.map((equipe) => (
              <option key={equipe.id} value={equipe.nomEquipe}>
                {equipe.nomEquipe}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          {sportsList.map((s) => (
            <label key={s} style={{ marginRight: "1em" }}>
              <input
                type="radio"
                name="sport"
                value={s}
                checked={sport === s}
                onChange={() => handleSportChange(s)}
              />
              {s}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <input
            type="text"
            placeholder="Rechercher une équipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <hr />
        <div className="form-actions">
          <button
            type="submit"
            className="button"
            style={{ marginRight: "12em" }}
          >
            Ajouter dans mes favoris
          </button>
          <NavLink to="/mesEquipes" className="button">
            Aller à Mes Équipes
          </NavLink>
        </div>
      </form>
    </div>
  );
};

export default EquipesFavorites;
