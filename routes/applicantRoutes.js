const express = require("express");
const router = express.Router();
const applicantController = require("../controllers/applicantController");
const { verifyToken } = require("../middleware/authenticate");
const s3Upload = require('../middleware/s3Upload');

router.post("/addApplicantInfo" , verifyToken, s3Upload.array('files', 1), applicantController.addApplicantInfo);
router.post("/addApplicantDocument" , verifyToken, s3Upload.any(), applicantController.addApplicantDocument);
router.post("/applicantEditDocument" , verifyToken, s3Upload.any(), applicantController.applicantEditDocument);

router.put("/addApplicantGuardianInfo" , verifyToken, applicantController.addApplicantGuardianInfo);
router.put("/addApplicantAddressInfo" , verifyToken, applicantController.addApplicantAddressInfo);
router.put("/addApplicantSchoolInfo" , verifyToken, applicantController.addApplicantSchoolInfo);
router.put("/addApplicantSchoolPreference" , verifyToken, applicantController.addApplicantSchoolPreference);

router.get("/getApplicantInfo" , verifyToken, applicantController.getApplicantInfo);
router.get("/getApplicantGuardianInfo" , verifyToken, applicantController.getApplicantGuardianInfo);
router.get("/getApplicantAddressInfo" , verifyToken, applicantController.getApplicantAddressInfo);
router.get("/getApplicantSchoolInfo" , verifyToken, applicantController.getApplicantSchoolInfo);
router.get("/getApplicantSchoolPreference" , verifyToken, applicantController.getApplicantSchoolPreference);
router.get("/getApplicantPDFinfo" , verifyToken, applicantController.getApplicantPDFinfo);
router.get("/getApplicantDocuments" , verifyToken, applicantController.getApplicantDocuments);
router.get("/getIsApplicantVerified" , verifyToken, applicantController.getIsApplicantVerified);

router.delete('/deleteS3Document', verifyToken, applicantController.deleteS3Document)

module.exports = router;