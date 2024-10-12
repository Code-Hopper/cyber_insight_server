import express from "express"
import { authStudent } from "../middleware/auth.js"
import { authStudentTool } from "../middleware/authTool.js"
import { validateStudentAuth } from "../middleware/validateStudentAuth.js"
import { loginStudent, registerStudent, studentDashboard, validateStudent , runCompiler } from "../controllers/controller.js"


let router = express()

router.get("/", (req, res) => { res.status(201).json("server home route !") })

router.post("/action/registerStudent", registerStudent)

router.post("/action/loginstudent", loginStudent)

router.get("/my-account", authStudent, studentDashboard)

router.get("/toolaccess/:id", authStudentTool, studentDashboard)

router.get("/validateStudent", validateStudentAuth, validateStudent)

// special tools route

router.post("/api/runcode", authStudentTool , runCompiler)

export { router }