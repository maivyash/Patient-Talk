const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

    // Extract token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  

    req.hospitalId = decoded.id; // 👈 IMPORTANT
    next();
    
  } catch (error) {
    return res.status(412).json({
      success: false,
      message: `"Invalid or expired token"${error}`,
    });
  }
};

module.exports = authMiddleware;
