const User = require("../model/authModel");
const jwt = require("jsonwebtoken");

module.exports.checkUser = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    
    if (!token) {
      return res.json({ status: false });
    }

    const decodedToken = jwt.verify(token, "kishan sheth super secret key");

    const user = await User.findById(decodedToken.id);

    if (!user) {
      return res.json({ status: false });
    }

    // User is authenticated
    return res.json({
      status: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        // Include any other user properties needed
      },
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
