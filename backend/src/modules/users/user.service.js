const userModel = require('./user.model');

exports.getAllUsers = async () => {
  return userModel.findAll();
};

exports.getUserById = async (id) => {
  return userModel.findById(id);
};
