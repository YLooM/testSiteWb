import React, { useState, useEffect } from "react";
import ListeSports from "./ListeSport";

const SoccerPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="centered-container">
      <h2 className="h2">Équipes de Soccer</h2>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une équipe..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Utilisation du composant ListeSports avec le filtre "soccer" */}
      <ListeSports searchTerm={searchTerm} sportFilter="soccer" />
    </div>
  );
};

export default SoccerPage;
