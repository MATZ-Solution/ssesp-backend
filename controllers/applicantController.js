const { queryRunner } = require("../helper/queryRunner");
const { getTotalPage } = require("../helper/getTotalPage");
const divisionData = require("../data/schools_grouped_by_division_updated_gender");
const { appendFile } = require("fs");

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

    const insertProjectQuery = `SELECT applicantID FROM applicants_info WHERE applicantID = ? `;
    const insertFileResult = await queryRunner(insertProjectQuery, [userId]);

    if (insertFileResult[0]?.length === 0) {

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

    } else {

      const insertProjectQuery = `UPDATE applicants_info SET studentName = ?, gender = ?, studentBForm = ?, 
      dob = ?, religion = ?, fileUrl = ?, fileKey = ?, status = ? WHERE applicantID = ?`;

      const values = [studentName, gender, studentBForm, dob, religion, file.location, file.key, "guardian-info-2", userId];
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
    guardianName,
    guardianCNIC,
    guardianDomicileDistrict,
    guardianProfession,
    guardianannualIncome,
    relation,
    guardianContactNumber,
    guardianContactWhattsappNumber
  } = req.body;

  try {
    const values = [
      guardianName,
      guardianCNIC,
      guardianDomicileDistrict,
      guardianProfession,
      guardianannualIncome,
      relation,
      guardianContactNumber,
      guardianContactWhattsappNumber,
      "address-3",
      userId,
    ];
    const insertProjectQuery = `UPDATE applicants_info SET guardianName = ?, guardianCNIC = ?, guardianDomicileDistrict = ?,
      guardianProfession=?, guardianannualIncome= ?, relation= ?, guardianContactNumber= ?, guardianContactWhattsappNumber= ?, status = ? WHERE applicantID = ? `;

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
      // headmasterContact,
      "document-upload-5",
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

    if (Array.isArray(previous_school) && previous_school.length > 0) {
      for (const school of previous_school) {
        const insertResult = await queryRunner(
          `INSERT INTO applicant_school 
          (class, schoolCategory, semisCode, district, yearOfPassing, applicantID) 
          VALUES (?, ?, ?, ?, ?, ?)`,
          [
            school.class,
            school.schoolCategory,
            school.semisCode,
            school.district,
            school.yearOfPassing,
            userId,
          ]
        );

        if (insertResult[0].affectedRows <= 0) {
          return res.status(500).json({
            statusCode: 500,
            message: "Failed to insert previous school.",
          });
        }
      }
    }

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

exports.addApplicantDocument = async function (req, res) {
  const { userId } = req.user;

  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "No files uploaded.",
      });
    }

    if (req.files.length > 4) {
      return res.status(400).json({
        statusCode: 400,
        message: "Too many files. Maximum 4 files allowed.",
      });
    }

    for (const file of req.files) {
      const result = await queryRunner(
        "INSERT INTO applicant_document (applicantID, documentName, fileUrl, fileKey) VALUES (?, ?, ?, ?)",
        [userId, file.fieldname, file.location, file.key]
      );

      if (result[0].affectedRows <= 0) {
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to save file.",
        });
      }
    }

    const result = await queryRunner(
      "UPDATE applicants_info SET status = ? WHERE applicantID = ?",
      ['school-preference-6', userId]
    );

    if (result[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Files uploaded successfully.",
      });
    } else {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || "Failed to submit file.",
      });
    }

  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Failed to submit file.",
    });
  }
};

exports.addApplicantSchoolPreference = async function (req, res) {

  const { userId } = req.user;
  const { first_priority_school, second_priority_school, third_priority_school } = req.body;

  try {
    const values = [first_priority_school, second_priority_school, third_priority_school, "completed", userId];

    const insertProjectQuery = `UPDATE applicants_info SET 
    first_priority_school = ?, second_priority_school = ?, third_priority_school = ?, status = ?
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
    const getQuery = `SELECT  guardianName,
      guardianCNIC,
      guardianDomicileDistrict,
      guardianProfession,
      guardianannualIncome,
      relation,
      guardianContactNumber,
      guardianContactWhattsappNumber FROM applicants_info WHERE applicantID = ?`;
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

exports.getApplicantSchoolPreference = async (req, res) => {

  const { userId } = req.user;
  try {
    const getQuery = `SELECT guardianDomicileDistrict, gender FROM applicants_info WHERE applicantID = ?`;

    const selectResult = await queryRunner(getQuery, [userId]);

    if (selectResult[0].length > 0) {

      const district = divisionData
        ?.find(district => district.district === selectResult?.[0][0]?.guardianDomicileDistrict);

      const school = district?.schools?.filter(
        item => item.gender === selectResult[0][0]?.gender
      );

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: school || [],
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

exports.getApplicantPDFinfo = async (req, res) => {

  const { userId } = req.user;
  try {
    const getQuery = `SELECT studentName, gender, fileUrl, studentBForm, dob, religion,
    guardianName, guardianCNIC, relation, guardianDomicileDistrict, guardianContactNumber, guardianannualIncome, guardianContactWhattsappNumber,
    postalAddress, division, district, 
    schoolName, schoolCategory, schoolSemisCode, studyingInClass, enrollmentYear, schoolGRNo,
    first_priority_school, second_priority_school, third_priority_school
    FROM applicants_info WHERE applicantID = ?`;
    const selectResult = await queryRunner(getQuery, [userId]);

    const prevSchoolQuery = `SELECT class, schoolCategory, semisCode, district, yearOfPassing
    FROM applicant_school WHERE applicantID = ? `

    const prevSchoolResult = await queryRunner(prevSchoolQuery, [userId]);

    if (selectResult[0].length > 0 && prevSchoolResult[0].length > 0) {

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0] || [],
        previous_school: prevSchoolResult[0] || []
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
