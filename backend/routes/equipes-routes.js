const express = require("express");
const { check } = require("express-validator");
const EquipesController = require("../controllers/equipes-controller");
const router = express.Router();

// Middleware pour obtenir toutes les tâches

router.get("/", EquipesController.getEquipe);
router.get("/:eid", EquipesController.afficherEquipe);
router.get("", EquipesController.afficherToutequipe);

router.post(
  "/",
  [
    check("nomEquipe").not().isEmpty(),
    check("sport").not().isEmpty(),
    check("imageUrl").not().isEmpty(),
  ],
  EquipesController.creerEquipe
);

router.patch("/:eid", EquipesController.modifierEquipe);

router.delete("/:eid", EquipesController.supprimerEquipe);

module.exports = router;
