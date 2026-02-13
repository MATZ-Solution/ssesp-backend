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
      "guardian-info-2",
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
      "address-3",
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
  const { postalAddress, district, division } = req.body;

  try {
    const values = [postalAddress, district, division, "school-info-4", userId];
    const insertProjectQuery = `UPDATE applicants_info SET postalAddress = ?, district = ?, division = ?, 
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
    previous_school,
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
      "test-preference-5",
      userId,
    ];

    const updateQuery = `
      UPDATE applicants_info SET 
      schoolName = ?, 
      schoolCategory = ?, 
      schoolSemisCode = ?, 
      studyingInClass = ?, 
      enrollmentYear = ?, 
      schoolGRNo = ?, 
      headmasterName = ?, 
      headmasterContact = ?, 
      status = ?
      WHERE applicantID = ?
    `;

    const updateResult = await queryRunner(updateQuery, values);

    if (updateResult[0].affectedRows <= 0) {
      return res.status(500).json({
        statusCode: 500,
        message: "Failed to update school info.",
      });
    }

    // if (Array.isArray(previous_school) && previous_school.length > 0) {
    //   for (const school of previous_school) {
    //     const insertResult = await queryRunner(
    //       `INSERT INTO applicant_school 
    //       (schoolName, class, school_category, semis_code, district, applicantID) 
    //       VALUES (?, ?, ?, ?, ?, ?)`,
    //       [
    //         school.schoolName,
    //         school.class,
    //         school.school_category,
    //         school.semis_code,
    //         school.district,
    //         userId,
    //       ]
    //     );

    //     if (insertResult[0].affectedRows <= 0) {
    //       return res.status(500).json({
    //         statusCode: 500,
    //         message: "Failed to insert previous school.",
    //       });
    //     }
    //   }
    // }

    return res.status(200).json({
      statusCode: 200,
      message: "School information added successfully.",
    });

  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Failed to add school.",
    });
  }
};


exports.addApplicantTestPreference = async function (req, res) {
  const { userId } = req.user;
  const { testMedium, division, acknowledgment } = req.body;

  try {
    const values = [testMedium, division, acknowledgment, "completed", userId];

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

exports.addApplicantDocument = async function (req, res) {
  const { studentName, gender, studentBForm, dob, religion } = req.body;
  const { userId } = req.user;

  try {
    if (req.files.length > 0) {
      for (const file of req.files) {
        const insertFileResult = await queryRunner(
          "INSERT INTO project_files (fileUrl, fileKey, projectID) VALUES (?, ?, ?)",
          [file.location, file.key, projectID],
        );
        if (insertFileResult.affectedRows <= 0) {
          return res.status(500).json({
            statusCode: 500,
            message: "Failed to add files",
          });
        }
      }
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

exports.getApplicantInfo = async (req, res) => {
  const { userId } = req.user;
  try {
    const getQuery = `SELECT studentName, gender, studentBForm, dob, religion FROM applicants_info WHERE applicantID = ?`;
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
    const getQuery = `SELECT fatherName, fatherCNIC, domicileDistrict, guardianName, guardianContact, contact1, contact2 FROM applicants_info WHERE applicantID = ?`;
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
    const getQuery = `SELECT postalAddress, district, division FROM applicants_info WHERE applicantID = ?`;
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
    schoolGRNo, headmasterName, headmasterContact FROM applicants_info WHERE applicantID = ?`;

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
    const getQuery = `SELECT domicileDistrict, gender FROM applicants_info WHERE applicantID = ?`;

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
