const jwt = require("jsonwebtoken");
const UserService = require("../services/UserService");

const isAdmin = async (req, res, next) => {
    try {
        let token = req.header("Authorization");

        if (!token) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        // CLEANUP: Remove 'Bearer ' AND strip any accidental literal quotes from localStorage
        token = token.replace("Bearer ", "").replace(/"/g, "").trim();

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const tokenUserId = decoded.id || decoded.userId;

        const user = await UserService.findById(tokenUserId);

        if (!user || user.role !== "admin") {
            console.log(`VIP Check Failed! User is: ${user ? user.name : 'Unknown'}, Role: ${user ? user.role : 'None'}`);
            return res.status(403).json({ message: "Access Denied. Admins only, bro!" });
        }

        req.user = user;
        next();

    } catch (error) {
        // If it fails again, this will print EXACTLY what the broken token looks like so we can see it!
        console.error("Admin Auth Error:", error.message);
        console.log("The broken token received was:", req.header("Authorization"));
        res.status(401).json({ message: "Invalid token or unauthorized." });
    }
};

module.exports = isAdmin;