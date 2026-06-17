const express = require('express');
const studentController = require('./student.controller');
const authMiddleware = require('../../middleware/auth.middleware');

const router = express.Router();

router.get('/', authMiddleware, studentController.getAllStudents);
router.get('/:id', authMiddleware, studentController.getStudentById);
router.post('/', authMiddleware, studentController.createStudent);
router.put('/:id', authMiddleware, studentController.updateStudent);
router.delete('/:id', authMiddleware, studentController.deleteStudent);

module.exports = router;
