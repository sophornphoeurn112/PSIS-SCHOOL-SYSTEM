import { pushToBackend } from "./storeSync";

// Writes a collection to localStorage (for instant synchronous reads) and
// mirrors it to the backend database (best-effort) so data persists.
const persist = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  pushToBackend(key, value);
};

const TEACHER_STORAGE_KEY = "psis_teacher_accounts";
const SCHEDULE_STORAGE_KEY = "psis_schedule_data";
const STUDENT_STORAGE_KEY = "psis_student_accounts";
const STAFF_STORAGE_KEY = "psis_staff_accounts";
const CLASS_STORAGE_KEY = "psis_classes";
const ATTENDANCE_STORAGE_KEY = "psis_attendance_records";
const ACADEMIC_STORAGE_KEY = "psis_academic_records";

export const GRADE_OPTIONS = Array.from(
  { length: 12 },
  (_, index) => `Grade ${index + 1}`,
);

const defaultStudents = [
  {
    id: 1,
    schoolId: "STD001",
    name: "Ali Ahmed",
    nameKhmer: "អាលី អាហ្មែត",
    username: "ali123",
    gender: "Male",
    studentClass: "Grade 10",
    dateOfBirth: "2008-06-12",
    dateJoined: "2022-09-01",
    phone: "0123456789",
    password: "Welcome@123",
    status: "active",
  },
  {
    id: 2,
    schoolId: "STD002",
    name: "Fatima Khan",
    nameKhmer: "ហ្វាទីមា ខាន",
    username: "fatima456",
    gender: "Female",
    studentClass: "Grade 10",
    dateOfBirth: "2009-03-22",
    dateJoined: "2023-01-15",
    phone: "0987654321",
    password: "Welcome@123",
    status: "active",
  },
];

const defaultTeachers = [
  {
    id: 1,
    schoolId: "TCH001",
    name: "Mr. John Smith",
    nameKhmer: "លោក ជន ស្មីត",
    username: "john123",
    email: "john@school.com",
    subject: "Mathematics",
    gender: "Male",
    dateOfBirth: "1980-05-10",
    dateJoined: "2010-08-15",
    phone: "0123456789",
    status: "active",
    role: "teacher",
    password: "Welcome@123",
  },
  {
    id: 2,
    schoolId: "TCH002",
    name: "Ms. Sarah Johnson",
    nameKhmer: "អ្នកគ្រូ សារ៉ា ចនសុន",
    username: "sarah456",
    email: "sarah@school.com",
    subject: "English",
    gender: "Female",
    dateOfBirth: "1985-11-20",
    dateJoined: "2014-01-12",
    phone: "0987654321",
    status: "active",
    role: "teacher",
    password: "Welcome@123",
  },
];

const defaultSchedules = [
  {
    id: 1,
    class: "Grade 10",
    teacher: "Mr. John Smith",
    subject: "Mathematics",
    day: "Monday",
    time: "09:00-10:00",
    room: "Room 101",
  },
  {
    id: 2,
    class: "Grade 10",
    teacher: "Ms. Sarah Johnson",
    subject: "English",
    day: "Tuesday",
    time: "10:00-11:00",
    room: "Room 102",
  },
];

export const getTeacherAccounts = () => {
  const stored = localStorage.getItem(TEACHER_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return defaultTeachers;
    }
  }
  persist(TEACHER_STORAGE_KEY, defaultTeachers);
  return defaultTeachers;
};

export const saveTeacherAccounts = (teachers) => {
  persist(TEACHER_STORAGE_KEY, teachers);
};

export const getTeacherByCredentials = (username, password) => {
  return getTeacherAccounts().find(
    (teacher) => teacher.username === username && teacher.password === password,
  );
};

export const updateTeacherAccount = (updatedUser) => {
  const teachers = getTeacherAccounts();
  const nextTeachers = teachers.map((teacher) =>
    teacher.username === updatedUser.username
      ? { ...teacher, ...updatedUser }
      : teacher,
  );
  saveTeacherAccounts(nextTeachers);
  return nextTeachers;
};

export const getSchedules = () => {
  const stored = localStorage.getItem(SCHEDULE_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return defaultSchedules;
    }
  }
  persist(SCHEDULE_STORAGE_KEY, defaultSchedules);
  return defaultSchedules;
};

export const saveSchedules = (schedules) => {
  persist(SCHEDULE_STORAGE_KEY, schedules);
};

const defaultStaff = [
  {
    id: 1,
    schoolId: "STF001",
    name: "Staff Member",
    nameKhmer: "បុគ្គលិក",
    username: "staff",
    email: "staff@school.com",
    position: "Office Administrator",
    gender: "Female",
    dateOfBirth: "1990-04-18",
    dateJoined: "2018-03-01",
    phone: "0112233445",
    status: "active",
    role: "staff",
    password: "Staff123",
  },
];

export const getStaffAccounts = () => {
  const stored = localStorage.getItem(STAFF_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return defaultStaff;
    }
  }
  persist(STAFF_STORAGE_KEY, defaultStaff);
  return defaultStaff;
};

export const saveStaffAccounts = (staff) => {
  persist(STAFF_STORAGE_KEY, staff);
};

export const getStaffByCredentials = (username, password) => {
  return getStaffAccounts().find(
    (member) => member.username === username && member.password === password,
  );
};

export const getStudents = () => {
  const stored = localStorage.getItem(STUDENT_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return defaultStudents;
    }
  }
  persist(STUDENT_STORAGE_KEY, defaultStudents);
  return defaultStudents;
};

export const saveStudents = (students) => {
  persist(STUDENT_STORAGE_KEY, students);
};

export const getClasses = () => {
  const stored = localStorage.getItem(CLASS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return [...GRADE_OPTIONS];
    }
  }
  persist(CLASS_STORAGE_KEY, GRADE_OPTIONS);
  return [...GRADE_OPTIONS];
};

export const saveClasses = (classes) => {
  persist(CLASS_STORAGE_KEY, classes);
};

export const addClass = (name) => {
  const trimmed = (name || "").trim();
  const classes = getClasses();
  if (!trimmed || classes.includes(trimmed)) return classes;
  const next = [...classes, trimmed];
  saveClasses(next);
  return next;
};

export const getAttendanceRecords = () => {
  const stored = localStorage.getItem(ATTENDANCE_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return [];
    }
  }
  return [];
};

export const saveAttendanceRecords = (records) => {
  persist(ATTENDANCE_STORAGE_KEY, records);
};

export const addAttendanceRecord = (record) => {
  const next = [record, ...getAttendanceRecords()];
  saveAttendanceRecords(next);
  return next;
};

export const getAcademicRecords = () => {
  const stored = localStorage.getItem(ACADEMIC_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      return [];
    }
  }
  return [];
};

export const saveAcademicRecords = (records) => {
  persist(ACADEMIC_STORAGE_KEY, records);
};

export const addAcademicRecord = (record) => {
  const next = [record, ...getAcademicRecords()];
  saveAcademicRecords(next);
  return next;
};
