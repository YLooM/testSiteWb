import React, { useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import Card from "../UIElements/Card";
import "../Equipe.css";
import { Link } from "react-router-dom";

const EquipeSports = (props) => {
  const auth = useContext(AuthContext);

  return (
    <React.Fragment>
      <li className="equipe-item">
        {" "}
        <Card className="team-content">
          {" "}
          <div className="logo-and-name-container">
            {" "}
            <div className="equipe-item__image">
              <img
                src={props.imageUrl}
                alt={props.nomEquipe}
                className="logo-image"
              />{" "}
            </div>
            <div className="team-name">{props.nomEquipe}</div>{" "}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default EquipeSports;
