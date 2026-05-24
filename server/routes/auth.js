const express = require('express');
const router = express.Router();
const { loginDoctor, registerDoctor, registerPatient, loginPatient } = require('../controllers/authController');

router.post('/doctor/login', loginDoctor);
router.post('/doctor/register', registerDoctor);
router.post('/patient/register', registerPatient);
router.post('/patient/login', loginPatient);

module.exports = router;
