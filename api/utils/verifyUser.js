import jwt from 'jsonwebtoken';
import { errorHandler } from "./error.js";


export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler(401, 'You need to be logged in' ));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, 'Token not valid'))
        req.user = user;
        next();
    });
}