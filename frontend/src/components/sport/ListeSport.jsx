import React, { useState, useEffect } from "react";
import Card from "../UIElements/Card";
import EquipeSports from "./equipeSports";
import "../EquipesList.css";

const ListeSports = (props) => {
  const { searchTerm, sportFilter } = props;
  const [sports, setSports] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}equipes`
        );
        if (!response.ok) {
          throw new Error(
            "Une erreur est survenue lors du chargement des équipes."
          );
        }
        const responseData = await response.json();
        setSports(responseData.equipes);
      } catch (error) {
        console.error("Erreur de chargement des équipes:", error);
      }
    };

    fetchData();
  }, []);

  const filteredEquipes =
    sports && sports.length > 0
      ? sports.filter((equipe) => {
          // Vérifier si equipe.sport et equipe.nomEquipe sont définis
          const equipeSport = equipe.sport ? equipe.sport.toLowerCase() : "";
          const equipeNom = equipe.nomEquipe
            ? equipe.nomEquipe.toLowerCase()
            : "";

          // Filtrer par sport si un filtre est spécifié
          if (sportFilter && equipeSport) {
            return (
              equipeSport === sportFilter.toLowerCase() &&
              equipeNom.includes(searchTerm.toLowerCase())
            );
          } else {
            // Sinon, filtrer uniquement par le terme de recherche
            return equipeNom.includes(searchTerm.toLowerCase());
          }
        })
      : [];

  if (filteredEquipes.length === 0) {
    return (
      <div className="equipe-list center">
        <Card>
          <h2>Équipe non trouvée</h2>
        </Card>
      </div>
    );
  }

  return (
    <ul className="equipes-list">
      {filteredEquipes.map((equipe) => (
        <EquipeSports
          key={equipe.id}
          id={equipe.id}
          imageUrl={equipe.imageUrl}
          nomEquipe={equipe.nomEquipe}
          sport={equipe.sport}
        />
      ))}
    </ul>
  );
};

export default ListeSports;
