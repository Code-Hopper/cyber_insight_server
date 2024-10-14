import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Admin schema and model
let adminSchema = mongoose.Schema({
    id: { type: String, required: true },
    password: { type: String, required: true },
    token: String
});

let adminModel = mongoose.model("admin", adminSchema);

export { adminModel }

// Function to create an admin if it doesn't exist
async function createAdminIfNotExists() {
    try {
        // Check if admin exists
        const admin = await adminModel.findOne({ id: "admin" });

        if (!admin) {
            // If admin doesn't exist, create one
            const hashedPassword = await bcrypt.hash("admin@123", 10); // Hash the password
            const newAdmin = new adminModel({
                id: "admin",
                password: hashedPassword
                // token: "your-token" // You can generate or assign a token here
            });

            await newAdmin.save(); // Save the admin to the database
            console.log("Admin created successfully!");
        } else {
            console.log("Admin already exists!");
        }
    } catch (error) {
        console.error("Error creating admin:", error);
    }
}

// Call the function to check and create the admin
createAdminIfNotExists();