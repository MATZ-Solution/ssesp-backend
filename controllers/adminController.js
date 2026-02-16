const { queryRunner } = require("../helper/queryRunner");
const handleNotifications = require("../utils/sendnotification");
const { getTotalPage } = require("../helper/getTotalPage");

exports.getDashbaordData = async (req, res) => {
  // const { userId } = req.user;
  try {
    const getQuery = `SELECT 
    COUNT(*) AS total_application,
    (SELECT COUNT(*) FROM applicants_info WHERE gender = 'male') AS total_male_application,
    (SELECT COUNT(*) FROM applicants_info WHERE gender = 'female') AS total_female_application
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

exports.getDashbaordApplicantData = async (req, res) => {
  // const { userId } = req.user;
  const limit = 10;
  const { status = 'completed', page = 1 } = req.query;
  const offset = (page - 1) * limit;

  try {

    let baseQuery = ` FROM applicants_info `
    let whereClause = "";

    if (status) {
      whereClause += `WHERE status = '${status}' `;
    }

    const getQuery = `SELECT applicantID, studentName, schoolCategory, studyingInClass, status
    ${baseQuery}
    ${whereClause}
     LIMIT ${limit} OFFSET ${offset}
    `;
    const selectResult = await queryRunner(getQuery);

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


