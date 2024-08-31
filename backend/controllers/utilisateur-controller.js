const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const User = require("../models/utilisateurs");
const HttpError = require("../util/http-error");

//EnregistrerUtilisateur

const registerUser = async (req, res, next) => {
  const { name, password, courriel, image } = req.body;
  console.log("Enregistre l'utilisateur");
  let utilisateurEx;
  try {
    utilisateurEx = await User.findOne({ name: name });
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Enregistrement échoué, veuillez réessayer plus tard.",
      500
    );
    return next(error);
  }
  console.log("UtilisateurExistant", utilisateurEx);
  if (utilisateurEx) {
    const error = new HttpError(
      "Un utilisateur avec ce nom existe déja utiliser un nouveau nom",
      422
    );
    return next(error);
  }
  const utilisateurNv = new User({ name, image, courriel, password });
  console.log("utilisateurCréer", utilisateurNv);
  try {
    await utilisateurNv.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Enregistrement échoué, veuillez réessayer plus tard.",
      500
    );
    return next(error);
  }
  res.status(201).json({ user: utilisateurNv.toObject({ getters: true }) });
};

//ModifierUtilisateur

const modifierUtilisateur = async (req, res, next) => {
  const utilisateurId = req.params.uid;
  const nvUtilisateur = req.body;

  try {
    const modifUtilisateur = await User.findByIdAndUpdate(
      utilisateurId,
      nvUtilisateur,
      {
        new: true,
      }
    );
    if (!modifUtilisateur) {
      return res
        .status(404)
        .json({ message: "L'Utilisateur n'a pas été trouver" });
    }
    res
      .status(200)
      .json({ user: modifUtilisateur.toObject({ getters: true }) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Erreur lors de la modification de l'utilisateurs" });
  }
};

//AfficherUtilisateur

const afficherUtilisateur = async (req, res, next) => {
  const utilisateurId = req.params.uid;
  let utilisateur;
  try {
    utilisateur = await User.findById(utilisateurId);
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }
  if (!utilisateur) {
    return next(new HttpError("L'Utilisateur n'a pas été trouver", 404));
  }
  res.json({ utilisateur: utilisateur.toObject({ getters: true }) });
};

const afficherToutUtilisateur = async (req, res, next) => {
  let utilisateurs;
  try {
    utilisateurs = await User.find({});
  } catch (e) {
    console.log(e);
    const err = new HttpError("Une erreur BD est survenue", 500);
    return next(err);
  }
  if (!utilisateurs || utilisateurs.length === 0) {
    return next(new HttpError("Aucun utilisateur n'a été trouvé", 404));
  }
  res.json({
    utilisateurs: utilisateurs.map((utilisateur) =>
      utilisateur.toObject({ getters: true })
    ),
  });
};
//Login
const Login = async (req, res, next) => {
  const { courriel, password } = req.body;
  console.log(courriel, password);

  try {
    const identifiedUser = await User.findOne({ courriel, password });
    console.log(identifiedUser);

    if (!identifiedUser) {
      return res.status(401).json({
        message: "Identification échouée, vérifiez vos identifiants.",
      });
    }

    let token = jwt.sign(
      { userId: identifiedUser.id, courriel: identifiedUser.courriel },
      "cleSuperSecrete!",
      { expiresIn: "1h" }
    );
    console.log(token);

    res.status(201).json({
      userId: identifiedUser.id,
      courriel: identifiedUser.courriel,
      token: token,
      admin: identifiedUser.Admin,
    });
  } catch (err) {
    console.error(err);
    const error = new HttpError(
      "Connexion Échouer veuiller Éssayer plus tard",
      500
    );
    return next(error);
  }
};

//Exporter les méthodes

exports.registerUser = registerUser;
exports.modifierUtilisateur = modifierUtilisateur;
exports.afficherUtilisateur = afficherUtilisateur;
exports.afficherToutUtilisateur = afficherToutUtilisateur;
exports.Login = Login;
