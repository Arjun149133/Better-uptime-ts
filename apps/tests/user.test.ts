import axios, { AxiosError } from "axios";
import {describe, expect, test, it} from "bun:test";
import { BACKEND_URL } from "./config";

const USER_NAME = "test_user" + Math.random().toString();

describe("Signup endpoints", () => {
   test("Isn't able to sign up if body is incorrect", async () => {
    try {
        await axios.post(`${BACKEND_URL}/auth/signup`, {
            email: USER_NAME,
            password: "password"
        });

        throw new Error("Request should have failed");
    } catch (err: AxiosError | any) {
        expect(err.response.status).toBe(400);
        expect(err.response.data.error).toBeDefined();
    }
});

   test("Signs up successfully with valid body", async () => {
        const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
            username: USER_NAME,
            password: "password"
        }, {
            validateStatus: () => true
        });

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty("id");
    });
    
})

describe("Signin endpoints", () => {
    test("Isnt able to sign in if body is incorrect", async () => {
        const res = await axios.post(`${BACKEND_URL}/auth/signin`, {
            email: USER_NAME,
            password: "password"
        }, {
            validateStatus: () => true
        })

        expect(res.status).toBe(400);
    })

    test("Is able to sign in if body is incorrect", async () => {
        const res = await axios.post(`${BACKEND_URL}/auth/signin`, {
            username: USER_NAME,
            password: "password"
        }, {
            validateStatus: () => true
        });
        expect(res.status).toBe(200);
        expect(res.data.jwt).toBeDefined();
    })
})