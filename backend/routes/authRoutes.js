
const express = require("express");

const router = express.Router();

const {
    registerIndividual,
    registerOrganization,
    login
} = require("../controllers/authController");

router.post("/register/individual", registerIndividual);

router.post("/register/organization", registerOrganization);

router.post("/login", login);

module.exports = router;
