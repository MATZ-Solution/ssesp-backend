const { queryRunner } = require("../helper/queryRunner");
const { getTotalPage } = require("../helper/getTotalPage");

exports.addApplicantInfo = async function (req, res) {
  const { studentName, gender, studentBForm, dob, religion } = req.body;
  const { userId } = req.user;
  const file = req.files[0];
  try {
    const values = [
      userId,
      studentName,
      gender,
      studentBForm,
      dob,
      religion,
      file.location,
      file.key,
      'guardian-info/2'
    ];
    const insertProjectQuery = `INSERT INTO applicants_info(applicantID, studentName, gender, studentBForm, dob, religion, fileUrl, fileKey, status) VALUES (?,?,?,?,?,?,?,?,?) `;

    const insertFileResult = await queryRunner(insertProjectQuery, values);

    if (insertFileResult[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Form submitted successfully.",
      });
    } else {
      return res.status(500).json({
        statusCode: 500,
        message: "Failed to submit form.",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Failed to submit form.",
      message: error.message,
    });
  }
};

exports.addApplicantGuardianInfo = async function (req, res) {
  const { userId } = req.user;
  const {
    fatherName,
    fatherCNIC,
    domicileDistrict,
    guardianName,
    guardianContact,
    contact1,
    contact2,
  } = req.body;

  try {
    const values = [
      fatherName,
      fatherCNIC,
      domicileDistrict,
      guardianName,
      guardianContact,
      contact1,
      contact2,
      "address/3",
      userId,
    ];
    const insertProjectQuery = `UPDATE applicants_info SET fatherName = ?, fatherCNIC = ?, domicileDistrict = ?, guardianName= ?,
     guardianContact= ?, contact1= ?, contact2= ?, status = ? WHERE applicantID = ? `;

    const insertFileResult = await queryRunner(insertProjectQuery, values);

    if (insertFileResult[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Form submitted successfully.",
      });
    } else {
    }
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to submit form.",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Failed to submit form.",
      message: error.message,
    });
  }
};

exports.addApplicantAddressInfo = async function (req, res) {
  const { userId } = req.user;
  const { postalAddress, district, city } = req.body;

  try {
    const values = [postalAddress, district, city, "school-info/4", userId];
    const insertProjectQuery = `UPDATE applicants_info SET postalAddress = ?, district = ?, city = ?, 
    status = ? WHERE applicantID = ? `;

    const insertFileResult = await queryRunner(insertProjectQuery, values);

    if (insertFileResult[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Form submitted successfully.",
      });
    } else {
    }
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to submit form.",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Failed to submit form.",
      message: error.message,
    });
  }
};

exports.addApplicantSchoolInfo = async function (req, res) {
  const { userId } = req.user;
  const {
    schoolName,
    schoolCategory,
    schoolSemisCode,
    studyingInClass,
    enrollmentYear,
    schoolGRNo,
    headmasterName,
    headmasterContact,
  } = req.body;

  try {
    const values = [
      schoolName,
      schoolCategory,
      schoolSemisCode,
      studyingInClass,
      enrollmentYear,
      schoolGRNo,
      headmasterName,
      headmasterContact,
      "test-preference/5",
      userId,
    ];

    const insertProjectQuery = `UPDATE applicants_info SET 
    schoolName = ?, schoolCategory = ?, schoolSemisCode = ?, studyingInClass = ?, enrollmentYear = ?,
    schoolGRNo = ?, headmasterName = ?, headmasterContact = ?, status = ?
    WHERE applicantID = ? `;

    const insertFileResult = await queryRunner(insertProjectQuery, values);

    if (insertFileResult[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Form submitted successfully.",
      });
    } else {
    }
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to submit form.",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Failed to submit form.",
      message: error.message,
    });
  }
};

exports.addApplicantTestPreference = async function (req, res) {
  const { userId } = req.user;
  const { testMedium, division, acknowledgment } = req.body;

  try {
    const values = [testMedium, division, acknowledgment, 'completed', userId];

    const insertProjectQuery = `UPDATE applicants_info SET 
    testMedium = ?, division = ?, acknowledgment = ?, status = ?
    WHERE applicantID = ? `;

    const insertFileResult = await queryRunner(insertProjectQuery, values);

    if (insertFileResult[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Form submitted successfully.",
      });
    } else {
    }
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to submit form.",
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Failed to submit form.",
      message: error.message,
    });
  }
};

exports.getApplicantInfo = async (req, res) => {
  const { userId } = req.user;
  try {
    const getQuery = `SELECT studentName, gender, studentBForm, dob, religion FROM applicants_info WHERE id = ?`;
    const selectResult = await queryRunner(getQuery, [userId]);

    if (selectResult[0].length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
      });
    } else {
      res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Data Not Found",
      error: error.message,
    });
  }
};

exports.getApplicantGuardianInfo = async (req, res) => {
  const { userId } = req.user;
  try {
    const getQuery = `SELECT fatherName, fatherCNIC, domicileDistrict, guardianName, guardianContact, contact1, contact2 FROM applicants_info WHERE id = ?`;
    const selectResult = await queryRunner(getQuery, [userId]);

    if (selectResult[0].length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
      });
    } else {
      res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Data Not Found",
      error: error.message,
    });
  }
};

exports.getApplicantAddressInfo = async (req, res) => {
  const { userId } = req.user;
  try {
    const getQuery = `SELECT postalAddress, district, city FROM applicants_info WHERE id = ?`;
    const selectResult = await queryRunner(getQuery, [userId]);

    if (selectResult[0].length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
      });
    } else {
      res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Data Not Found",
      error: error.message,
    });
  }
};

exports.getApplicantSchoolInfo = async (req, res) => {
  const { userId } = req.user;
  try {
    const getQuery = `SELECT schoolName, schoolCategory, schoolSemisCode, studyingInClass, enrollmentYear,
    schoolGRNo, headmasterName, headmasterContact FROM applicants_info WHERE id = ?`;

    const selectResult = await queryRunner(getQuery, [userId]);

    if (selectResult[0].length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
      });
    } else {
      res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Data Not Found",
      error: error.message,
    });
  }
};

exports.getApplicantTestPreference = async (req, res) => {
  const { userId } = req.user;
  try {
    const getQuery = `SELECT testMedium, division, acknowledgment FROM applicants_info WHERE id = ?`;

    const selectResult = await queryRunner(getQuery, [userId]);

    if (selectResult[0].length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
      });
    } else {
      res.status(200).json({
        data: [],
        message: "Data Not Found",
      });
    }
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Data Not Found",
      error: error.message,
    });
  }
};
