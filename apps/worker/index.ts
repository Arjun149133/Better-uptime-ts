import {xAckBulk, xReadGroup} from "@repo/redisstream/client"
import prisma from "@repo/store";
import axios from "axios";

const REGION_ID = process.env.REGION_ID!
const WORKER_ID = process.env.WORKER_ID!

if (!REGION_ID || !WORKER_ID) {
    throw new Error("REGION_ID and WORKER_ID must be set in the environment variables")
}

async function main() {
    while(1) {
        const res = await xReadGroup(REGION_ID, WORKER_ID);

        if (!res) {
            console.log("No messages found, waiting...");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
            continue;
        }

        let promises = res.map(({message}) => fetchWebsite(message.url, message.id))
        await Promise.all(promises)

        xAckBulk(REGION_ID, res.map(({id}) => id));
    }
}

async function fetchWebsite(url: string, website_id: string) {
    return new Promise<void>((resolve, reject) => {
        const startTime = Date.now();

        axios.get(url).then(async () => {
            const endTime = Date.now();
            const duration = endTime - startTime;

            await prisma.website_tick.create({
                data: {
                    website_id,
                    status: "UP",
                    response_time_ms: duration,
                    region_id: REGION_ID,
                }
            })
            resolve();
        }).catch(async () => {
            const endTime = Date.now();
            const duration = endTime - startTime;

            await prisma.website_tick.create({
                data: {
                    website_id,
                    status: "DOWN",
                    response_time_ms: duration,
                    region_id: REGION_ID,
                }
            })
            resolve();
        })
    })

}