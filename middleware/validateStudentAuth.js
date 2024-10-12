// validate user based on token
import jwt from "jsonwebtoken"
import { studentModel } from "../models/studentSchema.js"

let validateStudentAuth = async (req, res, next) => {

    try {

        let userToken = req.headers.authorization

        if (!userToken) {
            throw ("user token or Id not found !")
        }

        // decode the token

        let decodedTokenData = jwt.verify(userToken, process.env.JWT_SECRET)

        let userId = decodedTokenData.userId

        let userData = await studentModel.findOne({ email: userId, token: userToken })

        if (!userData) {
            return false
        }

        console.log("give access to student")

        next()

    } catch (err) {
        console.log("user token is not valid failed to auth for tools validation ! ", err)
        res.status(401).json({ message: "failed to validate user !", problem: err })
    }

}

export { validateStudentAuth }