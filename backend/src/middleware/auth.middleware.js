const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.replace('Bearer ', '');
  // TODO: Verify JWT and attach user payload to req.user
  req.user = { id: 'placeholder' };
  next();
};

module.exports = authMiddleware;
