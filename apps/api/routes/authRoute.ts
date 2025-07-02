import prisma from "@repo/store";
import { Router, type Request, type Response } from "express";
import { signupSchema } from "../types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const authRouter = Router();

authRouter.post("/signup",  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const parsed = signupSchema.safeParse({ username, password });
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return
    }

    try {
        const userInDb = await prisma.user.findFirst({
            where: {
                username
            }
        })

        if (userInDb) {
            res.status(409).json({
                message: "User already exists."
            })
            return
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            }
        })

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }

});
    
authRouter.post("/signin",  async (req: Request, res: Response) => {
    const { username, password } = req.body;

    const parsed = signupSchema.safeParse({ username, password });
    if (!parsed.success) {
        res.status(400).json({ error: parsed.error.message });
        return
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                username
            }
        });

        if(!user) {
            res.status(404).json({
                error: "user not found"
            })
            return
        }

        const passwordInDb = user.password
        const isPasswordCorrect = await bcrypt.compare(password, passwordInDb);

        if (!isPasswordCorrect) {
            res.status(400).json({
                error: "wrong password!"
            })
            return
        }

        const token = jwt.sign(user.id, process.env.JWT_SECRET!)

        // console.log(user)
        res.status(200).json({
            jwt: token
        })
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong"
        })
    }
});