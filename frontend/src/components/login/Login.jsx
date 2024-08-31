import { useState, useContext, useEffect } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import Spinner from "../UIElements/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [entredValues, setEntredValues] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (identifier, value) => {
    setEntredValues((prevValue) => ({
      ...prevValue,
      [identifier]: value,
    }));
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}users/login`,
        "POST",
        JSON.stringify(entredValues),
        {
          "Content-Type": "application/json",
        }
      );

      auth.login(response.userId, response.token, response.admin);
      localStorage.setItem(
        "userSession",
        JSON.stringify({
          isLoggedIn: true,
          userId: response.userId,
          token: response.token,
          admin: response.admin,
        })
      );
      console.log(auth.admin);
      const userSession = localStorage.getItem("userSession");
      console.log("test utilisateur 111: " + userSession);
      navigate("/sport/sports");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <ModalMessageErreur message={error} onClose={() => clearError()} />

      <form onSubmit={authSubmitHandler}>
        <div className="conteneur-connexion">
          <h2> 🏈 Connexion ⚽</h2>
          <p>
            Veuillez entrer vos informations afin de vous connecter. Si vous
            êtes nouveau, cliquez sur "S'ENREGISTRER"
          </p>
          <div className="control no-margin">
            <label htmlFor="courriel">Courriel</label>
            <input
              id="courriel"
              type="string"
              name="courriel"
              onChange={(event) =>
                handleInputChange("courriel", event.target.value)
              }
              value={entredValues.input}
            />
          </div>

          <div className="control no-margin">
            <label htmlFor="password">Mot de Passe</label>
            <input
              id="password"
              type="password"
              name="password"
              onChange={(event) =>
                handleInputChange("password", event.target.value)
              }
              value={entredValues.password}
            />
          </div>

          <p className="form-actions">
            <Link to="/subscribe">
              <button className="button button-flat">S'ENREGISTRER</button>
            </Link>
            <button className="button">Connexion</button>
          </p>
        </div>
      </form>
    </>
  );
}
