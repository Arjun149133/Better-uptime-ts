import axios from "axios";
import { BACKEND_URL } from "./config";

export const createUser = async() => {
    const username = "test_user" + Math.random().toString();
    const password = "password";

    try {
        const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
        username,
        password
    })

        const signInRes = await axios.post(`${BACKEND_URL}/auth/signin`, {
            username, 
            password
        })

        return {
            id: res.data.id,
            jwt: signInRes.data.jwt
        }
    } catch (error) {
        console.error("Error creating user:", error);
        return undefined;
    }
}