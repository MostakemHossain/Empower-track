// middlewares/parseData.js
export const parseMultipartData = (req, res, next) => {
    try {
      if (req.body?.data) {
        req.body = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON format in 'data'",
      });
    }
  };