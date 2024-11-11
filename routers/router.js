import express from "express";
import multer from "multer";
import path from "path"; // Import path module
import { authStudent } from "../middleware/auth.js";
import { authStudentTool } from "../middleware/authTool.js";
import { validateStudentAuth } from "../middleware/validateStudentAuth.js";
import { loginStudent, registerStudent, studentDashboard, validateStudent, runCompiler, passwordManager, passwordManagerData, passwordDelete, adminLogin, adminDashboard, displayAllStudent, createCourse, getAllCourses, deleteCourse, deleteStudent, keyLogerFunction, fetchLoggedKey, saveQuiz, getQuizzes, deleteQuiz, getQuizById, validateQuizAnswers, getQuizzesStudents } from "../controllers/controller.js";
import { authAdmin } from "../middleware/authAdmin.js";
import { keyLoggerAuth } from "../middleware/keyLoggerAuth.js"

const router = express.Router();

// Home Route
router.get("/", (req, res) => res.status(201).json("Server home route!"));

// Student Authentication and Account Management
router.post("/action/registerStudent", registerStudent);
router.post("/action/loginstudent", loginStudent);
router.get("/my-account", authStudent, studentDashboard);
router.get("/toolaccess/:id", authStudentTool, studentDashboard);
router.get("/validateStudent", validateStudentAuth, validateStudent);

// Compiler and Password Manager Tools
router.post("/api/runcode", authStudentTool, runCompiler);
router.post("/api/:studentId/passwordmanager", authStudentTool, passwordManager);
router.get("/api/:studentId/passwordmanagerdata", authStudentTool, passwordManagerData);
router.delete("/api/:id/passwordmanager/:passwordIndex", authStudentTool, passwordDelete);

// Keylogger Routes
router.post("/:id/keylogger", keyLoggerAuth, keyLogerFunction);
router.get("/:id/getkeyloggerdata", keyLoggerAuth, fetchLoggedKey);

// Admin Authentication and Dashboard
router.post("/api/admin/login", adminLogin);
router.get("/admin/dashboard", authAdmin, adminDashboard);
router.get("/admin/dashboard/students", authAdmin, displayAllStudent);

// Multer Storage Configuration for Course Thumbnails
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "./courseUploads"), // Directory for course thumbnails
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)), // Unique filename
});

// Multer Middleware for Image Uploads with Validation
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error("Only images (jpeg, jpg, png) are allowed!"));
    }
});

// Admin Course Management Routes
router.post("/admin/dashboard/createCourse", authAdmin, upload.single("thumbnail"), createCourse);
router.get("/admin/dashboard/allCourses", getAllCourses);
router.delete("/admin/dashboard/coursedelete/:id", authAdmin, deleteCourse);
router.delete("/admin/dashboard/studentsdelete/:id", authAdmin, deleteStudent);

// Quiz Management Routes for Admin
router.post("/admin/dashboard/saveQuiz", authAdmin, saveQuiz);
router.get("/admin/dashboard/getQuizzes", getQuizzes);
router.delete("/admin/dashboard/deleteQuiz/:id", authAdmin, deleteQuiz);

// Student Quiz Access and Validation
router.get("/api/quizzes", getQuizzesStudents)
router.get("/api/quizzes/:id", getQuizById); // Route for student to access a specific quiz
router.post("/api/quizzes/:id/validate", validateQuizAnswers); // Route for student to validate quiz answers

export { router };