// validate user based on token
import jwt from "jsonwebtoken"
import { studentModel } from "../models/studentSchema.js"

let keyLoggerAuth = async (req, res, next) => {

    try {

        let checkUserId = req.params.id

        console.log(checkUserId)

        console.log("keylogger auth hited !")

        if (!checkUserId) {
            throw ("missing params !")
        }

        // check if student is registred

        let userData = await studentModel.findOne({ _id : checkUserId })

        if(!userData){
            return false
        }

        // console.log(userData)

        // console.log("auth success,log key data !")

        next()

    } catch (err) {
        console.log("error in auth of keylogger ! ", err)
        res.status(401).json({ message: "failed to validate user !", problem: err })
    }

}

export { keyLoggerAuth }