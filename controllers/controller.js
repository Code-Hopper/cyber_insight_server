import { studentModel } from "../models/studentSchema.js"
import { generateToken } from "../middleware/generateToken.js"
import { exec } from "child_process"
import bcrypt from "bcrypt"

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


export { registerStudent, loginStudent, studentDashboard, validateStudent, runCompiler }