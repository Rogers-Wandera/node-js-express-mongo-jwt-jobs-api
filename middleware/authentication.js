const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");


const authThentication = async (req,res,next) => {
  const authHeader = req.headers.authorization;

  if(!authHeader || !authHeader.startsWith("Bearer")){
    throw new UnauthenticatedError("Not authenticated")
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const payload = {userId: decoded.userId, name: decoded.name}
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthenticatedError("Not authenticated")
  }
}

module.exports = authThentication;