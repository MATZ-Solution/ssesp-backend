const express = require("express");
const router = express.Router();
const contactController = require("../controllers/contactController");
const { verifyToken } = require("../middleware/authenticate");
const validate = require('../middleware/validate')
const { addContactSchema } = require("../validators/contact.validator")
const authorizeRoles = require('../middleware/authorize')

router.get("/getAllContact", verifyToken, authorizeRoles("admin"), contactController.getAllContact);
router.get("/getAllInterOrg", verifyToken, authorizeRoles("admin"), contactController.getAllInternationalOrg);

router.post("/addContact", validate(addContactSchema), contactController.addContact);

router.put("/editContact/:id", contactController.editContact);


module.exports = router;

