const { verifyToken } = require("../middleware/authenticate");
const s3Upload = require('../middleware/s3Upload');
const adminController = require("../controllers/adminController");
const validate = require("../middleware/validate")
const { addUserSchema } = require("../validators/user.validator")
const express = require("express");
const authorizeRoles = require('../middleware/authorize')
const { addContactSchema } = require("../validators/contact.validator")

const router = express.Router();

router.get("/getDashbaordData", adminController.getDashbaordData);
router.get("/getDashbaordApplicantData", adminController.getDashbaordApplicantData);

// router.get("/getAllContact", verifyToken, authorizeRoles("admin"), adminController.getAllContact);


module.exports = router;
