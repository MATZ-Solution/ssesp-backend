const { verifyTokenAdmin } = require("../middleware/admin-authenticate");
const s3Upload = require('../middleware/s3Upload');
const adminController = require("../controllers/adminController");
const validate = require("../middleware/validate")
const { addUserSchema } = require("../validators/user.validator")
const express = require("express");
const authorizeRoles = require('../middleware/authorize')
const { addContactSchema } = require("../validators/contact.validator")

const router = express.Router();

// router.post("/signUp", adminController.adminSignUp);
router.post("/signIn", adminController.adminSignIn);

router.get("/getDashbaordData", verifyTokenAdmin, authorizeRoles("admin"), adminController.getDashbaordData);
router.get("/getDashbaordApplicantData", verifyTokenAdmin, authorizeRoles("admin"), adminController.getDashbaordApplicantData);

module.exports = router;
