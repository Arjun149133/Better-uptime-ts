import axios, { AxiosError } from "axios";
import {describe, expect, test, it, beforeAll} from "bun:test";
import { BACKEND_URL } from "./config";
import { createUser } from "./testUtils";

const USER_NAME = "test_user" + Math.random().toString();

describe("website creating", () => {
    let id: string;
    let jwt: string;

    beforeAll(async () => {
        const res = await createUser();
        if (!res) {
            throw new Error("Failed to create user");
        }

        id = res.id;
        jwt = res.jwt;        
    })

    test("Creates a website successfully", async () => {
        const res = await axios.post(`${BACKEND_URL}/website`, {
            url: `https://example.com/${Math.random().toString()}`,
        }, {
            headers: {
                Authorization: `${jwt}`
            },
            validateStatus: () => true
        });

        expect(res.status).toBe(200);
        expect(res.data).toHaveProperty("id");
    } )

    test("Creates a website failed without url", async () => {
        const res = await axios.post(`${BACKEND_URL}/website`, {
        }, {
            headers: {
                Authorization: `${jwt}`
            },
            validateStatus: () => true
        });

        expect(res.status).toBe(411);
    } )

     test("Creates a website failed without jwt header", async () => {
        const res = await axios.post(`${BACKEND_URL}/website`, {
        }, {
            validateStatus: () => true
        });

        expect(res.status).toBe(403);
    } )    
})

describe("can fetch website", () => {
    let user_id: string;
    let jwt: string;
    let user_id_2: string;
    let jwt_2: string;

    beforeAll(async () => {
        const res = await createUser();
        if (!res) {
            throw new Error("Failed to create user");
        }

        user_id = res.id;
        jwt = res.jwt;   
        
        const res2 = await createUser();
        if (!res2) {
            throw new Error("Failed to create second user");
        }

        user_id_2 = res2.id;
        jwt_2 = res2.jwt;
    })

    test("Fetches website status successfully", async () => {
        const url = `https://example.com/${Math.random().toString()}`;

        const createRes = await axios.post(`${BACKEND_URL}/website`, {
            url,
        }, {
            headers: {
                Authorization: `${jwt}`
            },
            validateStatus: () => true
        });

        expect(createRes.status).toBe(200);
        expect(createRes.data).toHaveProperty("id");

        const websiteId = createRes.data.id;

        const res = await axios.get(`${BACKEND_URL}/website/status/${websiteId}`, {
            headers: {
                Authorization: `${jwt}`
            },
            validateStatus: () => true
        });

        expect(res.status).toBe(200);
        expect(res.data.url).toBe(url);
        expect(res.data.id).toBe(websiteId);
        expect(res.data.user_id).toBe(user_id);
    } )

    test("Fetches website status failed with wrong user", async () => {
        const url = `https://example.com/${Math.random().toString()}`;

        const createRes = await axios.post(`${BACKEND_URL}/website`, {
            url,
        }, {
            headers: {
                Authorization: `${jwt_2}`
            },
            validateStatus: () => true
        });

        expect(createRes.status).toBe(200);
        expect(createRes.data).toHaveProperty("id");

        const websiteId = createRes.data.id;

        const res = await axios.get(`${BACKEND_URL}/website/status/${websiteId}`, {
            headers: {
                Authorization: `${jwt}`
            },
            validateStatus: () => true
        });

        expect(res.status).toBe(409);
    } )


})