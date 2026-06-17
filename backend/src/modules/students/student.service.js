const studentModel = require('./student.model');

exports.getAllStudents = async () => studentModel.findAll();

exports.getStudentById = async (id) => studentModel.findById(id);

exports.createStudent = async (data) => {
  const required = ['schoolId', 'name', 'username', 'password'];
  const missing = required.filter((field) => !data || !data[field]);
  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.status = 400;
    throw error;
  }
  return studentModel.create(data);
};

exports.updateStudent = async (id, data) => {
  const updated = await studentModel.update(id, data || {});
  if (!updated) {
    const error = new Error('Student not found');
    error.status = 404;
    throw error;
  }
  return updated;
};

exports.deleteStudent = async (id) => {
  const removed = await studentModel.remove(id);
  if (!removed) {
    const error = new Error('Student not found');
    error.status = 404;
    throw error;
  }
  return { id: removed.id };
};
