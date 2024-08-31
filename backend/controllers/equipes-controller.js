const HttpError = require("../util/http-error");
const EquipeModel = require("../models/equipe");

const getEquipe = async (req, res, next) => {
  try {
    const equipes = await EquipeModel.find({}).sort({ createdAt: -1 });
    res.status(200).json({ equipes });
  } catch (err) {
    next(new HttpError("Erreur lors de la récupération des équipes.", 500));
  }
};

const creerEquipe = async (req, res, next) => {
  const { nomEquipe, imageUrl, sport } = req.body;
  const createdEquipe = new EquipeModel({ nomEquipe, sport, imageUrl });

  try {
    await createdEquipe.save();
    res.status(201).json({ equipe: createdEquipe });
  } catch (err) {
    next(new HttpError("Impossible de créer l'équipe.", 500));
  }
};

const modifierEquipe = async (req, res, next) => {
  const equipeId = req.params.eid;
  const equipeModifier = req.body;

  try {
    const modifierequipe = await EquipeModel.findByIdAndUpdate(
      equipeId,
      equipeModifier,
      { new: true }
    );
    if (!modifierequipe) {
      return next(new HttpError("Équipe non trouvée.", 404));
    }
    res
      .status(200)
      .json({ equipe: modifierequipe.toObject({ getters: true }) });
  } catch (err) {
    next(new HttpError("Erreur lors de la modification de l'équipe.", 500));
  }
};

const supprimerEquipe = async (req, res, next) => {
  const equipeId = req.params.eid;

  try {
    const equipe = await EquipeModel.findByIdAndDelete(equipeId);
    if (!equipe) {
      return next(new HttpError("Équipe non trouvée.", 404));
    }
    res.status(200).json({ message: "Équipe supprimée." });
  } catch (err) {
    next(new HttpError("Erreur lors de la suppression de l'équipe.", 500));
  }
};

const afficherEquipe = async (req, res, next) => {
  const equipeId = req.params.eid;

  try {
    const equipe = await EquipeModel.findById(equipeId);
    if (!equipe) {
      return next(new HttpError("Équipe non trouvée.", 404));
    }
    res.status(200).json({ equipe: equipe.toObject({ getters: true }) });
  } catch (err) {
    next(new HttpError("Erreur lors de la récupération de l'équipe.", 500));
  }
};

const afficherToutequipe = async (req, res, next) => {
  try {
    const equipes = await EquipeModel.find({});
    if (!equipes || equipes.length === 0) {
      return next(new HttpError("Aucune équipe trouvée.", 404));
    }
    res.status(200).json({
      equipes: equipes.map((equipe) => equipe.toObject({ getters: true })),
    });
  } catch (err) {
    next(new HttpError("Erreur lors de la récupération des équipes.", 500));
  }
};

module.exports = {
  getEquipe,
  creerEquipe,
  modifierEquipe,
  supprimerEquipe,
  afficherEquipe,
  afficherToutequipe,
};
