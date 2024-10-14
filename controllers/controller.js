import { studentModel } from "../models/studentSchema.js"
import { adminModel } from "../models/adminSchema.js"
import { generateToken } from "../middleware/generateToken.js"
import { generateAdminToken } from "../middleware/generateTokenAdmin.js"
import { exec } from "child_process"
import bcrypt from "bcrypt"
import multer from "multer"
import { courseModel } from "../models/courseSchema.js"

let registerStudent = async (req, res) => {

    console.log("register student route cleared !")

    try {

        let studentData = req.body

        if (!studentData) {
            throw ("no student data !")
        }

        // check if email and phone already registered

        let checkUser = await studentModel.findOne({ $or: [{ email: studentData.email }, { phone: studentData.phone }] })

        if (checkUser) {
            console.log("student already exists", checkUser)
            throw ("student already exists")
        }

        let newStudent = new studentModel(studentData)

        await newStudent.save()

        console.log("Student registred successfully !")

        res.status(202).json({ message: "Student Registred Successfully, Please head to login !" })

    } catch (err) {
        console.log("error while register student : ", err)
        res.status(400).json({ message: "unable to register student !", problem: err })
    }
}

let loginStudent = async (req, res) => {
    try {
        let { email, password } = req.body

        let user = await studentModel.findOne({ email: email })

        if (!user) {
            throw ("student email not found !")
        }

        // compare password with encrypted password

        let result = await bcrypt.compare(password, user.password)

        console.log(result)

        // make a session/token using jwt if result is true

        if (!result) {
            throw ("wrong email or password !")
        }

        let token = await generateToken(user.email)

        console.log(token)

        res.status(202).json({ message: "login was successful !", whoami: user.email, token: token })

    } catch (err) {
        console.log("error while loging in : ", err)
        res.status(400).json({ message: "login was not successful !", problem: err })
    }
}

let studentDashboard = async (req, res) => {
    try {

        // console.log(req.admin)

        res.status(200).json({ message: "access granted ! ", studentData: req.admin })

    } catch (err) {
        console.log("access denied !", err)
        res.status(400).json({ message: "access denied ! ", problem: err })
    }
}

let validateStudent = async (req, res) => {
    res.status(200).json({ access: true, message: "user can access tools" })
}


let runCompiler = async (req, res) => {

    const { code } = req.body;  // Extract code from request body

    if (!code) {
        return res.status(400).json({ error: "No code provided" });
    }

    // Execute the code using Node.js (you can use a sandbox for security)
    exec(`node -e "${code}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ output: stderr });
        }
        res.status(200).json({ output: stdout || stderr });
    });

}

let passwordManager = async (req, res) => {
    try {
        let data = req.body;

        if (!data) {
            throw new Error("No data found from backend!");
        }

        // Assuming req.params.studentId is provided to identify the student
        let student = await studentModel.findById(req.params.studentId);

        if (!student) {
            throw new Error("Student not found");
        }

        // Add new data to passwordManager array
        student.passwordManager.push(data);

        // Save the student document with updated passwordManager
        await student.save();

        res.status(200).send("Password manager updated successfully!");

    } catch (err) {
        console.log("Error while updating password manager:", err);
        res.status(500).send("Error while updating password manager");
    }
}

let passwordManagerData = async (req, res) => {
    try {
        // Assuming req.params.studentId is provided to identify the student
        let student = await studentModel.findById(req.params.studentId);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Check if the passwordManager array exists and has data
        if (student.passwordManager && student.passwordManager.length > 0) {
            res.status(200).json(student.passwordManager);
        } else {
            res.status(200).json(null);  // Send null if no password data is available
        }

    } catch (err) {
        console.error("Error retrieving password manager data:", err);
        res.status(500).send("Error retrieving password manager data");
    }
}


let passwordDelete = async (req, res) => {
    try {
        let student = await studentModel.findById(req.params.id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        // Remove password from the passwordManager array
        student.passwordManager.splice(req.params.passwordIndex, 1);

        await student.save();

        res.status(200).send("Password deleted successfully");
    } catch (error) {
        res.status(500).send("Error deleting password");
    }
}

// admin section

let adminLogin = async (req, res) => {
    try {
        let { id, password } = req.body; // Extract id and password from request body

        // Find admin by id
        let admin = await adminModel.findOne({ id });
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found!' });
        }

        // Compare password
        let isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials!' });
        }

        // Generate JWT token
        let token = generateAdminToken(admin);

        // Respond with token and admin details to frontend
        return res.status(200).json({
            message: 'Login successful!',
            token,
            admin: {
                id: admin.id,
                role: 'admin' // You can add other fields if necessary
            }
        });

    } catch (err) {
        console.error('Error while admin login:', err);
        return res.status(500).json({ message: 'Server error!' });
    }
};

let adminDashboard = async (req, res) => {
    // Only accessible if token is valid and role is admin
    res.json({ message: 'Welcome to the Admin Dashboard!', adminId: req.admin.id });
}

let displayAllStudent = async (req, res) => {
    try {
        const students = await studentModel.find({}); // Fetch all students from the database
        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
}


let createCourse = async (req, res) => {
    try {
        const { title, description, instructor } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'Thumbnail image is required' });
        }

        // Create new course object
        const newCourse = new courseModel({
            title,
            description,
            instructor,
            thumbnail: req.file.filename // Save the image filename
        });

        // Save the course to the database
        await newCourse.save();

        res.status(201).json({
            message: 'Course created successfully',
            course: newCourse
        });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
}

let getAllCourses = async (req, res) => {
    try {

        let allCourses = await courseModel.find({})

        res.status(200).json({ message: "got all courses", allCourses })

    } catch (err) {
        res.status(500).json({ "message": "unable to fetch all courses", err })
    }
}

export { registerStudent, loginStudent, studentDashboard, validateStudent, runCompiler, passwordManager, passwordManagerData, passwordDelete, adminLogin, adminDashboard, displayAllStudent, createCourse , getAllCourses }