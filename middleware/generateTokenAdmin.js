import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config({path:"./config.env"})

const SECRET_KEY = process.env.JWT_SECRET; // Replace with your actual secret key

// Token generator function for admin
const generateAdminToken = (admin) => {
    return jwt.sign(
        { id: admin._id, email: admin.email, role: 'admin' },
        SECRET_KEY,
        { expiresIn: '1h' }
    );
};

export { generateAdminToken }
