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
    passwordManager: Array,
    logedKey: Array,
    token: String
})

// Pre-save hook to hash password and set default values
studentSchema.pre("save", async function () {
    try {
        this.timeStamp = new Date().toLocaleDateString();
        this.status = "regular";

        // Hash the password if it has been modified
        if (this.isModified("password")) {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(this.password, salt);
            this.password = hash;
        }
    } catch (err) {
        console.log("Error in pre-save middleware:", err);
    }
});

// Pre-update hook to manage updates
studentSchema.pre("findOneAndUpdate", async function (next) {
    try {
        let update = this.getUpdate();
        
        // If the password is being updated, hash the new password
        if (update.password) {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(update.password, salt);
            update.password = hash;
        }

        // Update timestamp field
        update.timeStamp = new Date().toLocaleDateString();

        next();
    } catch (err) {
        console.log("Error in pre-update middleware:", err);
        next(err);
    }
});

let studentModel = new mongoose.model("students", studentSchema)

export { studentModel }