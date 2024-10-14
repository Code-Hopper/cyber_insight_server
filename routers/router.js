import express from "express";
import multer from "multer";
import path from "path"; // Import path module
import { authStudent } from "../middleware/auth.js";
import { authStudentTool } from "../middleware/authTool.js";
import { validateStudentAuth } from "../middleware/validateStudentAuth.js";
import { loginStudent, registerStudent, studentDashboard, validateStudent, runCompiler, passwordManager, passwordManagerData, passwordDelete, adminLogin, adminDashboard, displayAllStudent, createCourse, getAllCourses, deleteCourse, deleteStudent } from "../controllers/controller.js";
import { authAdmin } from "../middleware/authAdmin.js";

let router = express();

router.get("/", (req, res) => { res.status(201).json("server home route !") });

router.post("/action/registerStudent", registerStudent);
router.post("/action/loginstudent", loginStudent);

router.get("/my-account", authStudent, studentDashboard);
router.get("/toolaccess/:id", authStudentTool, studentDashboard);
router.get("/validateStudent", validateStudentAuth, validateStudent);

// special tools route
router.post("/api/runcode", authStudentTool, runCompiler);
router.post("/api/:studentId/passwordmanager", authStudentTool, passwordManager);
router.get("/api/:studentId/passwordmanagerdata", authStudentTool, passwordManagerData);
router.delete('/api/:id/passwordmanager/:passwordIndex', authStudentTool, passwordDelete);

// admin login route
router.post("/api/admin/login", adminLogin);

// Protect the /dashboard route
router.get('/admin/dashboard', authAdmin, adminDashboard);
router.get('/admin/dashboard/students', authAdmin, displayAllStudent);

// Set up storage for course thumbnails using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './courseUploads'); // Directory for course thumbnails
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

// Initialize multer for handling course image uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }, // Limit to 5MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images (jpeg, jpg, png) are allowed!'));
        }
    }
});

router.post('/admin/dashboard/createCourse', authAdmin, upload.single('thumbnail'), createCourse)

router.get('/admin/dashboard/allCourses', getAllCourses)

// Route to delete a course by ID
router.delete('/admin/dashboard/coursedelete/:id', authAdmin, deleteCourse)

router.delete('/admin/dashboard/studentsdelete/:id', authAdmin, deleteStudent)



export { router };