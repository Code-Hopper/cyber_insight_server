import express from "express"
import { authStudent } from "../middleware/auth.js"
import { authStudentTool } from "../middleware/authTool.js"
import { loginStudent, registerStudent, studentDashboard } from "../controllers/controller.js"


let router = express()

router.get("/", (req, res) => { res.status(201).json("server home route !") })

router.post("/action/registerStudent", registerStudent)

router.post("/action/loginstudent", loginStudent)

router.get("/my-account", authStudent, studentDashboard)

router.get("/toolaccess/:id", authStudentTool, studentDashboard)

export { router }