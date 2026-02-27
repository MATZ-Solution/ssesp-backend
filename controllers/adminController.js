const { queryRunner } = require("../helper/queryRunner");
const handleNotifications = require("../utils/sendnotification");
const { getTotalPage } = require("../helper/getTotalPage");
const { selectQuery } = require("../constants/queries");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ExcelJS = require("exceljs");
const { AGE_RULES, CUTOFF_DATE } = require("../data/age-rules")

// exports.adminSignUp = async function (req, res) {
//   const { email, password, role } = req.body;
//   try {
//     const selectResult = await queryRunner(selectQuery("user", "email"), [
//       email,
//     ]);

//     if (selectResult[0].length > 0) {
//       return res.status(404).json({
//         statusCode: 200,
//         message: `User already exists on this email`,
//       });
//     }
//     const hashPassword = await bcrypt.hash(password, 10);
//     const insertQuery = `INSERT INTO user( email, password, role) VALUES (?,?,?) `;
//     const insertResult = await queryRunner(insertQuery, [
//       email,
//       hashPassword,
//       role
//     ]);

//     if (insertResult[0].affectedRows > 0) {
//       return res.status(200).json({
//         message: "User added successfully",
//       });
//     } else {
//       return res.status(200).json({
//         statusCode: 200,
//         message: "Failed to add user",
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       message: "Failed to add user",
//       message: error.message,
//     });
//   }
// };

exports.adminSignIn = async function (req, res) {

  const { email, password } = req.body;
  try {

    const query = ` SELECT id, email, password, role FROM user where email = ? `;
    const findUser = await queryRunner(query, [email]);

    if (findUser[0].length === 0) {
      return res.status(404).json({ message: "Invalid email or password" });
    }

    // Checking hash password
    const checkPass = await bcrypt.compare(password, findUser[0][0].password);
    if (!checkPass) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate Token
    const token = jwt.sign(
      { userId: findUser[0][0]?.id, email: findUser[0][0]?.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: 'strict',
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(200).json({
      // token: token,
      message: "LogIn successfull",
      data: {
        email: findUser[0][0].email,
        role: findUser[0][0].role,
        token: token
      },
    });
  } catch (error) {

    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to SignIn",
      error: error.message,
    });
  }
};

exports.adminVerifyAge = async function (req, res) {

  const { status, reason } = req.body;
  const { applicantID } = req.params;

  try {
    const applicationStatus = status === 'true' ? 'in review' : 'rejected';

    let query = `UPDATE applicants_info SET application_status = ?, is_age_verified = ?`;
    const params = [applicationStatus, status];

    if (status === 'false') {
      query += `, application_remark = ?`;
      params.push(reason);
    }

    if (status === 'true') {
      query += `, application_stage = ?`;
      params.push('view-form-2');
    }

    query += ` WHERE applicantID = ?`;
    params.push(applicantID);

    const result = await queryRunner(query, params);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Applicant not found.",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Age verification updated successfully.",
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.adminVerifyGuardianSalary = async function (req, res) {

  const { status, reason } = req.body;
  const { applicantID } = req.params;

  try {
    const applicationStatus = status === 'true' ? 'in review' : 'rejected';

    let query = `UPDATE applicants_info SET application_status = ?, is_gurdian_salary_verified = ?`;
    const params = [applicationStatus, status];

    if (status === 'false') {
      query += `, application_remark = ?`;
      params.push(reason);
    }
    if (status === 'true') {
      query += `, application_stage = ?`;
      params.push('view-form-3');
    }
    query += ` WHERE applicantID = ?`;
    params.push(applicantID);

    const result = await queryRunner(query, params);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Applicant not found.",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Age verification updated successfully.",
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.adminVerifyApplicantSchool = async function (req, res) {

  const { status, reason } = req.body;
  const { applicantID } = req.params;

  try {
    const applicationStatus = status === 'true' ? 'in review' : 'rejected';

    let query = `UPDATE applicants_info SET application_status = ?, is_school_verified = ?`;
    const params = [applicationStatus, status];

    if (status === 'false') {
      query += `, application_remark = ?`;
      params.push(reason);
    }

    if (status === 'true') {
      query += `, application_stage = ?`;
      params.push('view-form-4');
    }

    query += ` WHERE applicantID = ?`;
    params.push(applicantID);

    const result = await queryRunner(query, params);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({
        statusCode: 404,
        message: "Applicant not found.",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Age verification updated successfully.",
    });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Something went wrong.",
    });
  }
};

exports.adminVerifyDocument = async function (req, res) {

  const { verfication = [] } = req.body
  const { applicantID } = req.params

  try {

    if (verfication?.length === 0) {
      return res.status(500).json({
        statusCode: 500,
        message: "Invalid data provided",
      });
    }

    for (const data of verfication) {
      const result = await queryRunner(
        `UPDATE applicant_document SET status = ?, remark = ? WHERE id = ?`,
        [data.status, data.reason ?? null, data.id]
      );

      if (result[0].affectedRows <= 0) {
        return res.status(500).json({
          statusCode: 500,
          message: "Failed to save data.",
        });
      }
    }

    const [documents] = await queryRunner(
      `SELECT documentName, status, remark, fileUrl FROM applicant_document WHERE applicantID = ?`,
      [applicantID]
    );

    const incomeDoc = documents.find(doc => doc.documentName === 'Parents / Guardian Income Certficaition');
    const isIncomeMissing = !incomeDoc || !incomeDoc.fileUrl;
    const allApproved = documents.every(doc => doc.status === 'correct');

    if (allApproved && !isIncomeMissing) {
      await queryRunner(
        `UPDATE applicants_info SET application_status = ?, is_document_verified = ?, application_remark = ? WHERE applicantID = ?`,
        ['completed', 'true', null, applicantID]
      );
    } else {
      await queryRunner(
        `UPDATE applicants_info SET application_status = ?, application_remark = ?, is_document_verified = ? WHERE applicantID = ?`,
        ['in review', 'Document Verification Failed', 'false', applicantID]
      );
    }

    return res.status(200).json({
      statusCode: 200,
      message: "Documents verified successfully.",
    });

  } catch (error) {
    console.log("Error:", error);

    return res.status(500).json({
      statusCode: 500,
      message: error.message || "Failed to submit file.",
    });
  }
};

exports.getDashbaordData = async (req, res) => {
  // const { userId } = req.user;
  try {
    const getQuery = `SELECT COUNT(*) AS total_application,
    (SELECT COUNT(*) FROM applicants_info WHERE (gender = 'male' AND status = 'completed')) AS total_male_application,
    (SELECT COUNT(*) FROM applicants_info WHERE (gender = 'female' AND status = 'completed') ) AS total_female_application,
    (SELECT COUNT(*) FROM applicants_info WHERE status = 'completed') AS total_completed_application
    FROM applicants_info `;
    const selectResult = await queryRunner(getQuery);

    const queryDistrict = `SELECT district, COUNT(*) AS total FROM applicants_info GROUP BY district`
    const selectResultDistrict = await queryRunner(queryDistrict);

    const queryClass = `SELECT studyingInClass, COUNT(*) AS total FROM applicants_info GROUP BY studyingInClass`
    const selectResultClass = await queryRunner(queryClass);

    if (selectResult[0].length > 0) {

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
        districtData: selectResultDistrict[0],
        classData: selectResultClass[0]
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

exports.getDashbaordApplicantRecentData = async (req, res) => {

  try {

    const getQuery = `SELECT applicantID, studentName, schoolCategory, studyingInClass, status, created_at
     FROM applicants_info
     WHERE status = ?
     ORDER BY created_at DESC 
     LIMIT ? OFFSET ?
    `;
    const selectResult = await queryRunner(getQuery, ['completed', 10, 0]);

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

exports.getDashbaordApplicantData = async (req, res) => {

  const { userId } = req.user;
  const limit = 10;
  const { status = 'completed', page = 1, gender = '', district = '', class: studentClass = '', schoolType = '' } = req.query;
  const offset = (page - 1) * limit;

  try {

    let baseQuery = ` FROM applicants_info `

    let params = [];
    let conditions = [];

    if (status) {
      conditions.push(` status = ?`);
      params.push(status);
    }

    if (gender) {
      conditions.push(` gender = ? `);
      params.push(gender);
    }

    if (district) {
      conditions.push(` district = ? `);
      params.push(district);
    }

    if (studentClass) {
      conditions.push(` studyingInClass = ? `);
      params.push(studentClass)
    }

    if (schoolType) {
      conditions.push(` schoolCategory = ? `);
      params.push(schoolType);
    }

    let whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

    const getQuery = `SELECT applicantID, studentName, schoolCategory, studyingInClass, status, application_stage, created_at
    ${baseQuery}
    ${whereClause}
    ORDER BY created_at DESC 
     LIMIT ${limit} OFFSET ${offset}
    `;

    const selectResult = await queryRunner(getQuery, params);

    if (selectResult[0].length > 0) {

      const countQuery = ` SELECT COUNT(DISTINCT id) AS total ${baseQuery} ${whereClause} `;
      const totalPages = await getTotalPage(countQuery, limit, params);

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
        totalPages,

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

exports.getApplicantInfo = async (req, res) => {
  const { userId } = req.query;
  try {
    const getQuery = `
      SELECT studentName, gender, studentBForm, DATE(dob) as dob, 
      fileUrl, religion, studyingInClass, application_status, application_remark, is_age_verified,
      TIMESTAMPDIFF(YEAR, DATE(dob), ?) AS age
      FROM applicants_info 
      WHERE applicantID = ?
    `;

    const selectResult = await queryRunner(getQuery, [CUTOFF_DATE, userId]);

    if (selectResult[0].length > 0) {
      const student = selectResult[0][0]; // ✅ get first student object

      // ✅ Extract class number from "Class 8" → 8
      const classNumber = parseInt(student.studyingInClass.replace(/\D/g, ''));
      const maxAge = AGE_RULES[classNumber];

      const eligible = student.age <= maxAge;

      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
        maxAgeAllowed: maxAge,
        studentAge: student.age,
        eligible: eligible ? "Eligible" : "Not Eligible"
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
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.getApplicantGuardianInfo = async (req, res) => {
  const { userId } = req.query;
  try {
    const getQuery = `SELECT  guardianName,
      guardianCNIC,
      guardianDomicileDistrict,
      guardianProfession,
      guardianannualIncome,
      is_gurdian_salary_verified,
      relation,
      application_status, application_remark, is_gurdian_salary_verified,
      guardianContactNumber,
      siblings_under_sef,
      no_siblings_under_sef,
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

exports.getApplicantDocuments = async (req, res) => {
  const { userId } = req.query;
  try {
    const getQuery = `SELECT id, fileUrl, filekey, documentName, status, remark FROM applicant_document WHERE applicantID = ?`;
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
  const { userId } = req.query;
  try {

    const getQuery = `SELECT schoolName, schoolCategory, schoolSemisCode, studyingInClass, enrollmentYear,
    schoolGRNo, is_school_verified, headmasterName, headmasterContact,
     application_status, application_remark, is_school_verified
     FROM applicants_info WHERE applicantID = ?`;
    const selectResult = await queryRunner(getQuery, [userId]);

    const prevSchoolQuery = `SELECT class, schoolCategory, semisCode, district, yearOfPassing
    FROM applicant_school WHERE applicantID = ? `
    const prevSchoolResult = await queryRunner(prevSchoolQuery, [userId]);

    if (selectResult[0].length > 0 && prevSchoolResult[0].length > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
        previousSchool: prevSchoolResult[0]
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



exports.exportDashboardApplicantData = async (req, res) => {

  const {
    status = "completed",
    gender = "",
    district = "",
    class: studentClass = "",
    schoolType = ""
  } = req.query;

  try {

    let baseQuery = ` FROM applicants_info `;
    let params = [];
    let conditions = [];

    if (status) {
      conditions.push(` status = ?`);
      params.push(status);
    }

    if (gender) {
      conditions.push(` gender = ? `);
      params.push(gender);
    }

    if (district) {
      conditions.push(` district = ? `);
      params.push(district);
    }

    if (studentClass) {
      conditions.push(` studyingInClass = ? `);
      params.push(studentClass);
    }

    if (schoolType) {
      conditions.push(` schoolCategory = ? `);
      params.push(schoolType);
    }

    let whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const query = `
      SELECT
        applicantID,
        studentName,
        gender,
        fileUrl,
        studentBForm,
        dob,
        religion,
        guardianName,
        guardianCNIC,
        relation,
        guardianDomicileDistrict,
        guardianContactNumber,
        guardianannualIncome,
        guardianContactWhattsappNumber,
        postalAddress,
        division,
        district,
        schoolName,
        schoolCategory,
        schoolSemisCode,
        studyingInClass,
        enrollmentYear,
        schoolGRNo,
        status,
        created_at
      ${baseQuery}
      ${whereClause}
      ORDER BY created_at DESC
    `;

    const result = await queryRunner(query, params);
    const data = result[0];

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Applicants");

    worksheet.columns = [
      { header: "Applicant ID",               key: "applicantID",                     width: 20 },
      { header: "Student Name",               key: "studentName",                     width: 25 },
      { header: "Gender",                     key: "gender",                          width: 12 },
      { header: "File URL",                   key: "fileUrl",                         width: 30 },
      { header: "Student B-Form",             key: "studentBForm",                    width: 20 },
      { header: "Date of Birth",              key: "dob",                             width: 18 },
      { header: "Religion",                   key: "religion",                        width: 15 },
      { header: "Guardian Name",              key: "guardianName",                    width: 25 },
      { header: "Guardian CNIC",              key: "guardianCNIC",                    width: 20 },
      { header: "Relation",                   key: "relation",                        width: 15 },
      { header: "Guardian Domicile District", key: "guardianDomicileDistrict",        width: 25 },
      { header: "Guardian Contact Number",    key: "guardianContactNumber",           width: 22 },
      { header: "Guardian Annual Income",     key: "guardianannualIncome",            width: 22 },
      { header: "Guardian WhatsApp Number",   key: "guardianContactWhattsappNumber",  width: 25 },
      { header: "Postal Address",             key: "postalAddress",                   width: 30 },
      { header: "Division",                   key: "division",                        width: 18 },
      { header: "District",                   key: "district",                        width: 18 },
      { header: "School Name",                key: "schoolName",                      width: 30 },
      { header: "School Category",            key: "schoolCategory",                  width: 20 },
      { header: "School SEMIS Code",          key: "schoolSemisCode",                 width: 20 },
      { header: "Class",                      key: "studyingInClass",                 width: 12 },
      { header: "Enrollment Year",            key: "enrollmentYear",                  width: 18 },
      { header: "School GR No",               key: "schoolGRNo",                      width: 18 },
      { header: "Status",                     key: "status",                          width: 15 },
      { header: "Created At",                 key: "created_at",                      width: 25 },
    ];

    worksheet.addRows(data);

    worksheet.getRow(1).font = { bold: true };

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Applicants.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error("Export error:", error);
    res.status(500).json({
      message: "Export Failed",
      error: error.message,
    });
  }
};
// exports.changePasword = async function (req, res) {
//   const { password, email } = req.body;
//   try {

//     const findUserQuery = `SELECT email FROM user WHERE email = ? `;
//     const findUserResult = await queryRunner(findUserQuery, [email]);

//     if (findUserResult[0].length > 0) {
//       const hashPassword = await bcrypt.hash(password, 10);
//       const insertQuery = `UPDATE users SET password = ? WHERE email = ? `;
//       const insertResult = await queryRunner(insertQuery, [
//         hashPassword,
//         findUserResult[0][0]?.email,
//       ]);
//       if (insertResult[0].affectedRows > 0) {
//         return res.status(200).json({
//           message: "password reset successfully",
//         });
//       } else {
//         return res.status(200).json({
//           statusCode: 200,
//           message: "failed to reset password",
//         });
//       }
//     } else {
//       return res.status(404).json({ message: "Email not found" });
//     }
//   } catch (error) {
//     console.log("error", error);
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };


