const express = require("express");
const router = express.Router();
const candidateController = require("../controllers/candidateController");
const { verifyToken } = require("../middleware/authenticate");
const s3Upload = require('../middleware/s3Upload');

router.post("/addCandidate" , candidateController.addCandidate);
// router.post("/addForm" , verifyToken, s3Upload.array('files', 1), formController.addForm);

module.exports = router;