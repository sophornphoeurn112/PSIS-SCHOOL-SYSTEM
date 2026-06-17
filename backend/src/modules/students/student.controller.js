const studentService = require('./student.service');

exports.getAllStudents = async (req, res, next) => {
  try {
    res.json(await studentService.getAllStudents());
  } catch (error) {
    next(error);
  }
};

exports.getStudentById = async (req, res, next) => {
  try {
    const student = await studentService.getStudentById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    next(error);
  }
};

exports.createStudent = async (req, res, next) => {
  try {
    const student = await studentService.createStudent(req.body);
    res.status(201).json(student);
  } catch (error) {
    next(error);
  }
};

exports.updateStudent = async (req, res, next) => {
  try {
    res.json(await studentService.updateStudent(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

exports.deleteStudent = async (req, res, next) => {
  try {
    res.json(await studentService.deleteStudent(req.params.id));
  } catch (error) {
    next(error);
  }
};
