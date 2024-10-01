const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (requiredRole = 1) => {
  return (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).send('Token chưa được cung cấp');

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.phanQuyen > requiredRole) {
        return res.status(403).send('Bạn không được phân quyền cho chức năng này');
      }
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send('Token hết hạn');
    }
  };
};

module.exports = authMiddleware;
