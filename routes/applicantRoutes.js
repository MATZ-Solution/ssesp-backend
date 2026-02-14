const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");
const { verifyToken } = require("../middleware/authenticate");
const s3Upload = require('../middleware/s3Upload');

router.post("/addApplicantInfo" , verifyToken, s3Upload.array('files', 1), applicantController.addApplicantInfo);
router.post("/addApplicantDocument" , verifyToken, s3Upload.any(), applicantController.addApplicantDocument);

router.put("/addApplicantGuardianInfo" , verifyToken, applicantController.addApplicantGuardianInfo);
router.put("/addApplicantAddressInfo" , verifyToken, applicantController.addApplicantAddressInfo);
router.put("/addApplicantSchoolInfo" , verifyToken, applicantController.addApplicantSchoolInfo);
router.put("/addApplicantSchoolPreference" , verifyToken, applicantController.addApplicantSchoolPreference);

router.get("/getApplicantInfo" , verifyToken, applicantController.getApplicantInfo);
router.get("/getApplicantGuardianInfo" , verifyToken, applicantController.getApplicantGuardianInfo);
router.get("/getApplicantAddressInfo" , verifyToken, applicantController.getApplicantAddressInfo);
router.get("/getApplicantSchoolInfo" , verifyToken, applicantController.getApplicantSchoolInfo);
router.get("/getApplicantSchoolPreference" , verifyToken, applicantController.getApplicantSchoolPreference);

module.exports = router;