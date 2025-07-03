import prisma from "@repo/store";
import {xAddBulk} from "@repo/redisstream/client"

async function main() {
    try {
        const websites = await prisma.website.findMany({
        select: {
            url: true,
            id: true
        }
    });

    const events = websites.map(website => ({
        url: website.url,
        id: website.id
    }));

    await xAddBulk(events);
    } catch (error) {
        console.error("Error in main function:", error);  
    }
}

setInterval(() => {
    main()
}, 1000 * 60 * 3); // every 5 minutes

main()