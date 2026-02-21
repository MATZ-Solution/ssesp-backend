const express = require("express");
const authorizeRoles = require('../middleware/authorize')
const adminController = require("../controllers/adminController");
const { verifyTokenAdmin } = require("../middleware/admin-authenticate");

const router = express.Router();

router.post("/signIn", adminController.adminSignIn);

router.get("/getDashbaordData", verifyTokenAdmin, authorizeRoles("admin"), adminController.getDashbaordData);
router.get("/getDashbaordApplicantRecentData", verifyTokenAdmin, authorizeRoles("admin"), adminController.getDashbaordApplicantRecentData);
router.get("/getDashbaordApplicantData", verifyTokenAdmin, authorizeRoles("admin"), adminController.getDashbaordApplicantData);

router.get("/getApplicantInfo" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantInfo);
router.get("/getApplicantGuardianInfo" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantGuardianInfo);
router.get("/getApplicantDocuments" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantDocuments);
router.get("/getApplicantSchoolInfo" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantSchoolInfo);

// router.get("/getApplicantAddressInfo" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantAddressInfo);
// router.get("/getApplicantSchoolInfo" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantSchoolInfo);
// router.get("/getApplicantSchoolPreference" , verifyTokenAdmin, authorizeRoles("admin"), adminController.getApplicantSchoolPreference);

// router.post("/signUp", adminController.adminSignUp);
// router.post("/changePasword", adminController.changePasword);

module.exports = router;
