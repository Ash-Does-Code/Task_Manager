import jwt from 'jsonwebtoken';

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
  const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }  

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }
    req.user = user;
    console.log(req.user);
    next();
  })
}

export default authenticateToken;