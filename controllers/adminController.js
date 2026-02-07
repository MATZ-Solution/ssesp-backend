const { queryRunner } = require("../helper/queryRunner");
const handleNotifications = require("../utils/sendnotification");
const { getTotalPage } = require("../helper/getTotalPage");

exports.getAllContact = async (req, res) => {
  const {
    search = "",
    category = "",
    country = "",
    department = "",
    sheets = "",
    page = 1,
  } = req.query;

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    let params = [];
    let conditions = [];

    let baseQuery = `
      FROM contacts c 
      LEFT JOIN countries country ON c.country = country_id
      LEFT JOIN category cat ON c.category = cat.category_id
      LEFT JOIN department dept ON c.department = dept.dept_id
    `;

    if (search) {
      conditions.push(` (c.name LIKE ? OR c.email LIKE ?) `);
      params.push(`%${search}%`, `%${search}%`);
    }

    if (country) {
      conditions.push(` country.country_name LIKE ? `);
      params.push(`%${country}%`);
    }

    if (department) {
      conditions.push(` dept.dept_name LIKE ? `);
      params.push(`%${department}%`);
    }

    if (category) {
      conditions.push(` cat.category_name LIKE ? `);
      params.push(`%${category}%`);
    }

    if (sheets) {
      conditions.push(` c.sheet = ? `);
      params.push(`${sheets}`);
    }

    let whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const getQuery = `
      SELECT c.id, c.name, c.email, c.contact_number, c.designation, c.organization, c.website, c.linkedIn_profile,
             c.address, c.sheet,
             country.country_name, cat.category_name, dept.dept_name
      ${baseQuery} 
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const selectResult = await queryRunner(getQuery, params);

    if (selectResult[0].length > 0) {
      const countQuery = `
        SELECT COUNT(*) AS total
        ${baseQuery}
        ${whereClause}
      `;

      const countResult = await queryRunner(
        countQuery,
        params.slice(0, params.length - 2)
      );
      const total = countResult[0][0].total;
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
        totalPages,
      });
    } else {
      return res.status(200).json({
        data: [],
        message: "Contact Not Found",
      });
    }
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to get contact",
      error: error.message,
    });
  }
};

exports.getAllInternationalOrg = async (req, res) => {
  const {
    search = "",
    category = "",
    country = "",
    department = "",
    page = 1,
  } = req.query;

  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    let params = [];
    let conditions = [];

    let baseQuery = `
      FROM international_organization int_org
      LEFT JOIN countries country ON int_org.country = country.country_id
      LEFT JOIN category cat ON int_org.category = cat.category_id
      LEFT JOIN department dept ON int_org.department = dept.dept_id
    `;

    // ---- Filters ----
    if (search) {
      conditions.push(
        ` (int_org.organization LIKE ? OR int_org.email LIKE ?) `
      );
      params.push(`%${search}%`, `%${search}%`);
    }

    if (country) {
      conditions.push(` country.country_name LIKE ? `);
      params.push(`%${country}%`);
    }

    if (department) {
      conditions.push(` dept.dept_name LIKE ? `);
      params.push(`%${department}%`);
    }

    if (category) {
      conditions.push(` cat.category_name LIKE ? `);
      params.push(`%${category}%`);
    }

    let whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    // ---- Select query ----
    const getQuery = `
      SELECT 
        int_org.ig_id, 
        int_org.email, 
        country.country_name, 
        int_org.organization,
        int_org.contact_number,
        int_org.organization, int_org.website,
        int_org.linkedIn_profile,
        int_org.address,
        cat.category_name, 
        dept.dept_name
      ${baseQuery}
      ${whereClause}
      LIMIT ? OFFSET ?
    `;

    params.push(limit, offset);

    const selectResult = await queryRunner(getQuery, params);

    if (selectResult[0].length > 0) {
      // For count, remove LIMIT & OFFSET
      const countParams = params.slice(0, params.length - 2);

      const countQuery = `
        SELECT COUNT(*) AS total
        ${baseQuery}
        ${whereClause}
      `;

      const countResult = await queryRunner(countQuery, countParams);
      const total = countResult[0][0].total;
      const totalPages = Math.ceil(total / limit);

      return res.status(200).json({
        statusCode: 200,
        message: "Success",
        data: selectResult[0],
        totalPages,
      });
    }

    return res.status(200).json({
      data: [],
      message: "Int. Data Not Found",
    });
  } catch (error) {
    console.error("Query error: ", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Failed to get contact",
      error: error.message,
    });
  }
};

exports.addContact = async function (req, res) {
  let { name, email, userType } = req.body;

  try {
    // Add project into database
    const insertProjectQuery = `INSERT INTO contacts(name, email, userType) VALUES (?,?,?) `;
    const values = [name, email, userType];

    const insertFileResult = await queryRunner(insertProjectQuery, values);

    // Add files into database
    if (insertFileResult[0].affectedRows > 0) {
      res.status(200).json({
        statusCode: 200,
        message: "Contact Added successfully",
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Failed to add Contact",
      });
    }
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      message: "Failed to add Contact",
      message: error.message,
    });
  }
};

exports.editContact = async function (req, res) {
  const { id } = req.params;
  const { name, email, userType } = req.body;

  try {
    const editQuery = `UPDATE contacts SET name = ?, email = ?, userType = ? WHERE contactID = ?`;
    const values = [name, email, userType, id];

    const updateResult = await queryRunner(editQuery, values);

    if (updateResult[0].affectedRows > 0) {
      return res.status(200).json({
        statusCode: 200,
        message: "Contact updated successfully",
      });
    } else {
      return res.status(200).json({
        statusCode: 200,
        message: "Failed to update contact.",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      message: "Failed to update contact.",
    });
  }
};


