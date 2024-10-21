import jwt from 'jsonwebtoken';

export const verifyJWT = (req, res, next) => {

    let token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "token not provided" });
    };

    token = token.split(" ")[1]

    try {
        const {email} = jwt.verify(token, process.env.JWT_SR);
        console.log(email);
        req.email=email
        next();
    } catch (error) {
        return res.status(400).json({ error: "invalid token" });
        
    }
}