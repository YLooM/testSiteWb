import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context"; // Importez le contexte d'authentification
import "../../components/EquipesList.css";
export const userEquipesPath = "/mesEquipes";

const MesEquipes = () => {
  const [mesEquipes, setMesEquipes] = useState([]);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchUserEquipes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}mesEquipes/${userId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des équipes.");
        }
        const data = await response.json();

        setMesEquipes(data.mesEquipes);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipes :", error);
      }
    };

    fetchUserEquipes();
  }, [userId]);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Mes Équipes Favorites</h2>
      <ul>
        {mesEquipes.map((equipe) => (
          <li key={equipe.id}>{equipe.nomEquipe}</li>
        ))}
      </ul>
    </div>
  );
};

export default MesEquipes;
