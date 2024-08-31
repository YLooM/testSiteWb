import React, { useState } from "react";
import ListeSports from "./ListeSport";
import "./sport.css";

const BasketballPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="centered-container">
      <h2 className="h2">Équipes de Baseball</h2>

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Rechercher une équipe..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />

      <ListeSports searchTerm={searchTerm} sportFilter="baseball" />
    </div>
  );
};

export default BasketballPage;
