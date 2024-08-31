import { useParams } from "react-router-dom";
import ListeSports from "../components/sport/ListeSport";
import { useEffect, useState } from "react";

const UserEquipes = () => {
  const userId = useParams().userId;
  const [equipes, setEquipes] = useState([]);

  useEffect(() => {
    const fetchUserEquipes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}equipes/${userId}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des équipes");
        }
        const data = await response.json();
        setEquipes(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des équipes :", error);
      }
    };

    fetchUserEquipes();
  }, [userId]);

  return <ListeSports items={equipes} />;
};

export default UserEquipes;
