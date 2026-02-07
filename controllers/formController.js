const { queryRunner } = require("../helper/queryRunner");
const { getTotalPage } = require("../helper/getTotalPage");

exports.addForm = async function (req, res) {
    const { userId } = req.user;
    let {
        budget,
        category,
        deadline,
        deliverable,
        description,
        duration,
        freelancerType,
        language,
        skills,
        subCategory,
        title,
    } = req.body;

    try {
       
        const insertProjectQuery = `INSERT INTO projects(title, budget, description, clientID, category, subCategory, deadline, duration, freelancerType, deliverable) VALUES (?,?,?,?,?,?,?,?,?,?) `;
        const values = [
            title,
            budget,
            description,
            userId,
            category,
            subCategory,
            formattedDeadline,
            duration,
            freelancerType,
            deliverable,
        ];

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