// validate user based on token
import jwt from "jsonwebtoken"
import { studentModel } from "../models/studentSchema.js"

let authStudentTool = async (req, res, next) => {

    try {

        let userToken = req.headers.authorization

        console.log(req.params)

        if (!userToken) {
            throw ("user token or Id not found !")
        }

        // decode the token

        let decodedTokenData = jwt.verify(userToken, process.env.JWT_SECRET)

        let userId = decodedTokenData.userId

        let userData = await studentModel.findOne({ email: userId, token: userToken, _id: req.params.id })

        if(!userData){
            return false
        }

        console.log("auth success, access tool now")

        next()

    } catch (err) {
        console.log("user token is not valid failed to auth ! ", err)
        res.status(401).json({ message: "failed to validate user !", problem: err })
    }

}

export { authStudentTool }