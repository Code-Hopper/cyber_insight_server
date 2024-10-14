import jwt from 'jsonwebtoken';  // Use 'import' instead of 'require'
import dotenv from "dotenv"

dotenv.config({ path: "./config.env" })

const SECRET_KEY = process.env.JWT_SECRET;  // Use const for secret key

export const authAdmin = (req, res, next) => {  // Use export to make the middleware available
    console.log("auth admin hit !")
    try {
        // Get the token from the request headers
        const token = req.headers.authorization; // Format: Bearer <token>

        console.log("adminToken" ,token)

        if (!token) {
            return res.status(403).json({ message: 'Access denied. No token provided.' });
        }

        // Verify the token
        const decoded = jwt.verify(token, SECRET_KEY);

        // Check if user is admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Not an admin.' });
        }

        req.admin = decoded; // Attach admin info to the request object
        next(); // Proceed to the next middleware or route

    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};