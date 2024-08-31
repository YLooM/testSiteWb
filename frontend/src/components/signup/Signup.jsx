import { useContext, useState } from "react";
import "./Signup.css";
import { Link } from "react-router-dom";
import ModalMessageErreur from "../UIElements/ModalMessageErreur";
import Spinner from "../UIElements/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";
export default function Signup() {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordAreNotEqual, setPasswordAreNotEqual] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const fd = new FormData(event.target);
    const data = Object.fromEntries(fd.entries());

    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}users/Register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", //pour que le bodyParser sache comment faire le parse
          },
          body: JSON.stringify(data),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (!response.ok) {
        throw new Error(responseData.message);
      }
      setIsLoading(false);
      auth.login();
    } catch (err) {
      setError(err.message || "Une erreur est survenue, essayez plus tard.");
      console.error(err);
    } finally {
      setIsLoading(false);
      navigate("/auth");
    }

    event.target.reset();
  }

  return (
    <>
      <div>
        {isLoading && <Spinner />}
        <ModalMessageErreur message={error} onClose={() => setError(null)} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="conteneur-inscription">
          <h2> 🎾 Bienvenue chez Laval Sport 🏒 </h2>
          <p>Entrez vos informations personnelle afin de creér votre compte</p>

          <div className="control">
            <label htmlFor="courriel">Courriel</label>
            <input id="courriel" type="email" name="courriel" required />
          </div>

          <div className="control-row">
            <div className="control">
              <label htmlFor="password">Mot de passe</label>
              <input id="password" type="password" name="password" />
            </div>
            <div className="control">
              <label htmlFor="confirm-password">
                Confirmation du mot de passe
              </label>
              <input
                id="confirm-password"
                type="password"
                name="confirm-password"
              />
              {passwordAreNotEqual ? (
                <div className="control-error">
                  <p>Les mots de passe ne sont pas identiques.</p>
                </div>
              ) : null}
            </div>
          </div>

          <hr />

          <div className="control-row">
            <div className="control">
              <label htmlFor="name">Nom</label>
              <input type="text" id="name" name="name" />
            </div>
          </div>
          <div className="control">
            <label htmlFor="image">Lien de l'image</label>
            <input type="text" id="image" name="image" />
          </div>
          <div className="control">
            <label htmlFor="terms-and-conditions">
              <input type="checkbox" id="terms-and-conditions" name="terms" />
              En cochant cette case, j'accepte les termes et conditions
              d'utilisations
            </label>
          </div>

          <p className="form-actions">
            <Link to="/auth">
              <button className="button button-flat">Connexion</button>
            </Link>
            <button type="submit" className="button">
              S'Enregistrer
            </button>
          </p>
        </div>
      </form>
    </>
  );
}
