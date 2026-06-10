const TEACHER_STORAGE_KEY = "psis_teacher_accounts";
const SCHEDULE_STORAGE_KEY = "psis_schedule_data";

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
    class: "Class 10A",
    teacher: "Mr. John Smith",
    subject: "Mathematics",
    day: "Monday",
    time: "09:00-10:00",
    room: "Room 101",
  },
  {
    id: 2,
    class: "Class 10B",
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
  localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(defaultTeachers));
  return defaultTeachers;
};

export const saveTeacherAccounts = (teachers) => {
  localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(teachers));
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
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(defaultSchedules));
  return defaultSchedules;
};

export const saveSchedules = (schedules) => {
  localStorage.setItem(SCHEDULE_STORAGE_KEY, JSON.stringify(schedules));
};
