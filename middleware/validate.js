const validate = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });
    // console.log("req[property]: ", req[property])
    if (error) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        details: error.details.map((err) => err.message)
      });
    }

    next();
  };
};

module.exports = validate