const express = require("express");

const usersController = require("../controllers/utilisateur-controller");
const router = express.Router();

router.post("/register", usersController.registerUser);
router.patch("/:uid", usersController.modifierUtilisateur);
router.get("/:uid", usersController.afficherUtilisateur);
router.get("", usersController.afficherToutUtilisateur);
router.post("/login", usersController.Login);
module.exports = router;
