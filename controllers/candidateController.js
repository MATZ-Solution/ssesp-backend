const { queryRunner } = require("../helper/queryRunner");
const { getTotalPage } = require("../helper/getTotalPage");

exports.addCandidate = async function (req, res) {
  try {

    const columns = Object.entries(req.body).map(([keys])=> keys)
    const value_question_mark = Object.entries(req.body).map(([keys])=> '?')
    const values = Object.entries(req.body).map(([_,values])=> values)

    const insertProjectQuery = `INSERT INTO forms(${columns}) VALUES (${value_question_mark}) `;
  
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


