
export const validateBody = (requiredFields = []) => {
  return (req, res, next) => {
    for (const field of requiredFields) {
      if (req.body[field] === undefined || req.body[field] === null) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`,
        });
      }
    }
    next();
  };
};


export const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const value = req.params[paramName];
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(value);

    if (!isValidObjectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
      });
    }

    next();
  };
};
