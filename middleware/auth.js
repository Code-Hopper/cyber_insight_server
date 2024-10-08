// validate user based on token
import jwt from "jsonwebtoken"
import { studentModel } from "../models/studentSchema.js"

let authStudent = async (req, res, next) => {

    try {

        let userToken = req.headers.authorization

        if (!userToken) {
            throw ("user token not found !")
        }

        // decode the token

        let decodedTokenData = jwt.verify(userToken, process.env.JWT_SECRET)

        let userId = decodedTokenData.userId

        let userData = await studentModel.findOne({ email: userId, token: userToken })

        console.log("auth success")
        req.admin = userData

        next()

    } catch (err) {
        console.log("user token is not valid failed to auth ! ", err)
        res.status(401).json({ message: "failed to validate user !", problem: err })
    }

}

export { authStudent }