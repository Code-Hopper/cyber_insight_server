import mongoose from "mongoose";
import bcrypt from "bcrypt"

let studentSchema = mongoose.Schema({
    name: String,
    dob: String,
    registrationNo: Number,
    status: String,
    phone: Number,
    email: String,
    password: String,
    token: String,
    timeStamp: String,
    currentEducation: String,
    intresetTopics: String,
    token: String
})

studentSchema.pre("save", async function () {
    try {

        this.timeStamp = new Date().toLocaleDateString()

        this.status = "regular"

        let salt = await bcrypt.genSalt(10)

        console.log(salt)

        let hash = await bcrypt.hash(this.password, salt)

        this.password = hash

    } catch (err) {
        console.log("error while pre methods in student schema : ", err)
    }
})

let studentModel = new mongoose.model("students", studentSchema)

export { studentModel }