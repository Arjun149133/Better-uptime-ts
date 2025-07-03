import { createClient } from "redis";

const client = await createClient()
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

export type WebsiteEvent = {url: string, id: string}
export type MessageType = {
    id: string;
    message: {
        url: string;
        id: string;
    }
}

const STREAM_NAME = "betteruptime:website";

export async function xAdd({url, id}: WebsiteEvent) {
    await client.xAdd(STREAM_NAME, "*", {
        url,
        id
    });
}

export async function xAddBulk(events: WebsiteEvent[]) {
    for (const event of events) {
        await xAdd(event);
    }
}

export async function xReadGroup(consumerGroup: string, workerId: string): Promise<MessageType[] | undefined> {
    const res = await client.xReadGroup(
        consumerGroup, workerId, 
        {
            key: STREAM_NAME,
            id: ">",
        }, {
            'COUNT': 5,
        }
    )

    //@ts-ignore
    let messages: MessageType[] | undefined = res?.[0]?.messages;

    return messages;
}

export async function xAck(consumerGroup: string, eventId: string) {
    await client.xAck(STREAM_NAME, consumerGroup, eventId);
}

export async function xAckBulk(consumerGroup: string, eventIds: string[]) {
    if (eventIds.length === 0) return;

    eventIds.map(eventId => xAck(consumerGroup, eventId));
}


// client.destroy();