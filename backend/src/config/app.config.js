module.exports = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret',
  nodeEnv: process.env.NODE_ENV || 'development',
};
