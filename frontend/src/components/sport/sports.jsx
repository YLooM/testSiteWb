import React, { useState } from "react";
import ListeSports from "./ListeSport";

const SportPage = () => {
  const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="centered-container">
      <h2 className="h2">Tous les sports</h2>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une équipe..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      {/* Utilisation du composant ListeSports sans filtre de sport spécifique */}
      <ListeSports searchTerm={searchTerm} />
    </div>
  );
};

export default SportPage;
