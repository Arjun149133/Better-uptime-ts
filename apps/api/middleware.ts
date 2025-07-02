import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token =  req.headers.authorization as string;

    if(!token) {
        res.status(403).json({
            message: "No token found"
        })
    }

    try {
        const userId = jwt.verify(token, process.env.JWT_SECRET!)
        req.userId = userId as string
        next()
    } catch (error) {
        console.log("message: ", error)
        res.status(500).json({
            message: "Something went wrong"
        })
        return
    }

}