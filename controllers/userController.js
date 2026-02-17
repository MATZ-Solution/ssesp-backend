const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { selectQuery, insertScoutUserQuery } = require("../constants/queries");
const { queryRunner } = require("../helper/queryRunner");
const { sendEmail } = require("../helper/emailService");
const { sendSMS } = require("../helper/smsService");
const {
  applicationIDTemplate,
} = require("../helper/applicationIDEmailTemplate");

require("dotenv").config();

// ###################### user Create #######################################
exports.signUp = async function (req, res) {

  const { email } = req.body;
  try {
    const query = `SELECT email FROM applicants where email = ?`;
    const selectResult = await queryRunner(query, [email]);

    if (selectResult[0].length > 0) {
      return res.status(404).json({
        statusCode: 200,
        message: `User already exists on this email`,
      });
    }

    const insertQuery = `INSERT INTO applicants(email) VALUES (?) `;
    const insertResult = await queryRunner(insertQuery, [email]);

    if (insertResult[0].affectedRows > 0) {
      const applicantID = `SSESP` + insertResult[0].insertId;
      const insertID = insertResult[0].insertId;

      const hashApplicationID = await bcrypt.hash(applicantID, 10);

      const updateQuery = `UPDATE applicants SET applicationID = ? WHERE id = ?`;
      const updateResult = await queryRunner(updateQuery, [
        hashApplicationID,
        insertID,
      ]);

      if (updateResult[0].affectedRows > 0) {

        const emailTemplate = applicationIDTemplate(applicantID);

        let emailStatus = await sendEmail(email, "Application ID", emailTemplate);

        console.log("emailStatus: ", emailStatus)

        if (!emailStatus.success) {

          const deleteQuery = `DELETE FROM applicants WHERE id = ?`;
          const updateResult = await queryRunner(deleteQuery, [insertID]);
          if (updateResult[0].affectedRows > 0) {
            return res.status(500).json({
              message: "Failed To send email.",
            });
          }
        }

        return res.status(200).json({
          message: "User added successfully",
          // applicantID: applicantID,
        });
      } else {
        return res.status(200).json({
          statusCode: 200,
          message: "Failed to add user",
        });
      }
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Failed to add user",
      });
    }
  } catch (error) {
    console.log("error: ", error);
    return res.status(500).json({
      message: error.message,
    });
  }
};
// // ######################  user Create #######################################

// // ###################### SignIn user start #######################################
exports.signIn = async function (req, res) {
  const { email, applicationID } = req.body;
  try {
    // const query = `
    // SELECT id, phoneNumber, applicationID
    // FROM applicants
    // where phoneNumber = ? `;
    const query = ` 
    SELECT a.id as userID, a.email, a.applicationID, ai.id, ai.status
    FROM applicants a LEFT JOIN applicants_info ai ON a.id = ai.applicantID
    where a.email = ? `;
    const findUser = await queryRunner(query, [email]);

    if (findUser[0].length === 0) {
      return res
        .status(404)
        .json({ message: "User does not exist on this email" });
    }

    // Checking hash password
    const checkPass = await bcrypt.compare(
      applicationID,
      findUser[0][0].applicationID,
    );
    if (!checkPass) {
      return res
        .status(401)
        .json({ message: "Invalid Email or Application ID" });
    }

    // Generate Token
    const token = jwt.sign(
      {
        userId: findUser[0][0]?.userID,
        email: findUser[0][0]?.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d",
      },
    );

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === 'production',
      secure: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });

    // Send response
    res.status(200).json({
      message: "LogIn successfull",
      data: {
        id: findUser[0][0].userID,
        email: findUser[0][0].email,
        token: token,
        formStatus: findUser[0][0].status,
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

exports.logout = async function (req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
};

exports.me = async function (req, res) {
  res.json({
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    },
  });
};

exports.verify = async function (req, res) {
  res.json({
    authenticated: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

// ###################### SignIn user End #######################################

// // ######################  password reset #######################################

exports.passwordReset = async function (req, res) {
  const { email } = req.body;
  try {
    const query = ` SELECT id, email FROM users where email = ? `;
    const findUser = await queryRunner(query, [email]);

    if (findUser[0].length === 0) {
      return res.status(404).json({ message: "Email not found" });
    }

    return res.status(200).json({ message: "Email found successfully" });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// // ######################  End #######################################

exports.sendOtp = async function (req, res) {
  const { email } = req.body;
  try {
    const pin = Math.floor(1000 + Math.random() * 9000);

    // FIND USER IF EXIST OR NOT
    const findUserQuery = `SELECT email from users WHERE email = ? `;
    const findUser = await queryRunner(findUserQuery, [email]);

    // IF USER EXISTS THEN ADD OTP IN DATABASE AND SEND EMAIL
    if (findUser[0].length > 0) {
      // INSERT OTP IN DATABASE
      const insertQuery = `UPDATE users SET otp = ? WHERE email = ? `;
      const insertResult = await queryRunner(insertQuery, [pin, email]);

      if (insertResult[0].affectedRows > 0) {
        // Send email
        sendEmail(
          findUser[0][0]?.email,
          "password reset",
          `your otp code is ${pin}`,
        );
        return res.status(200).json({ message: "Email send successfully." });
      } else {
        return res.status(404).json({ message: "Failed to send email." });
      }
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.submitOtp = async function (req, res) {
  const { otp, email } = req.body;
  try {
    // FIND USER EXISTS OR NOT
    const findUserQuery = `SELECT email, otp FROM users WHERE email = ? `;
    const findUserResult = await queryRunner(findUserQuery, [email]);

    if (findUserResult[0].length > 0) {
      // CHECK USER PROVIDED OTP AND DATABASE OTP MATCH OR NOT

      if (findUserResult[0][0]?.otp === otp) {
        return res.status(200).json({ message: "Otp match successfully" });
      } else {
        return res.status(404).json({ message: "Invalid Otp" });
      }
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.changePasword = async function (req, res) {
  const { password, email } = req.body;
  try {
    // FIND USER EXISTS OR NOT
    const findUserQuery = `SELECT email FROM users WHERE email = ? `;
    const findUserResult = await queryRunner(findUserQuery, [email]);

    if (findUserResult[0].length > 0) {
      // ENCRYPT PASSWORD AND ADD TO DATABASE
      const hashPassword = await bcrypt.hash(password, 10);
      const insertQuery = `UPDATE users SET password = ? WHERE email = ? `;
      const insertResult = await queryRunner(insertQuery, [
        hashPassword,
        findUserResult[0][0]?.email,
      ]);
      if (insertResult[0].affectedRows > 0) {
        return res.status(200).json({
          message: "password reset successfully",
          id: insertResult[0].insertid,
        });
      } else {
        return res.status(200).json({
          statusCode: 200,
          message: "failed to reset password",
        });
      }
    } else {
      return res.status(404).json({ message: "Email not found" });
    }
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

exports.addFreelancerDetails = async function (req, res) {
  const { name, gigs } = req.body;
  try {
    if (req.files.length > 0) {
      for (const file of req.files) {
        const insertFileResult = await queryRunner(
          "INSERT INTO location_files (scouted_location, fileUrl, fileKey) VALUES (?, ?, ?)",
          [scoutId, file.location, file.key],
        );
        if (insertFileResult.affectedRows <= 0) {
          return res.status(500).json({
            statusCode: 500,
            message: "Failed to add files",
          });
        }
      }
    }
    return res.status(200).json({ message: "api is working fine." });
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

// ###################### Get Scout Members start #######################################
exports.check = async function (req, res) {
  try {
    res.status(200).json({ message: " API working fine. " });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error " });
  }
};
