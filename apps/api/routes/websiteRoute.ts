import prisma from "@repo/store";
import { Router, type Request, type Response } from "express";
import { authMiddleware } from "../middleware";

export const websiteRouter = Router();

websiteRouter.post("/", authMiddleware, async (req: Request, res: Response) => {
    const {url} = req.body;

    if (!url) {
        res.status(411).json({message: "no url in body"})
        return
    }

    try {
        const website = await prisma.website.create({
            data:{
                url,
                user_id: req.userId!
            }
        })

        res.status(200).json({
            id: website.id
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
});

websiteRouter.get("/status/:websiteId", authMiddleware, async (req: Request, res: Response) => {
    const {websiteId} = await req.params;

    try {
        const website = await prisma.website.findFirst({
            where: {
                user_id: req.userId,
                id: websiteId
            },
            include: {
                ticks: {
                    orderBy: [{
                        createdAt: "desc"
                    }],
                    take: 1
                }
            }
        })
    
        if (!website) {
            res.status(409).json({
                message: "Website not found."
            })
            return
        }
    
        res.json({
            url: website.url,
            id: website.id,
            user_id: website.user_id
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Something went wrong"
        })
    }
});