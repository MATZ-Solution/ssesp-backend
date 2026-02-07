const express = require("express");
const router = express.Router();
const formController = require("../controllers/formController");
const { verifyToken } = require("../middleware/authenticate");
const s3Upload = require('../middleware/s3Upload');

router.post("/addForm" ,verifyToken, s3Upload.array('files', 1), formController.addForm);

module.exports = router;