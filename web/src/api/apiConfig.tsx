import axios from "axios";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

const baseURL = import.meta.env.VITE_API_URL;

// Create a function to get the API client lazily
const getApiClient = () => {
    const { initDataRaw } = retrieveLaunchParams();

    return axios.create({
        baseURL,
        headers: {
            Authorization: `tma ${initDataRaw}`,
        },
    });
};

// Export a proxy object that creates the client on first use
const apiClient = new Proxy({} as ReturnType<typeof getApiClient>, {
    get: (_, prop) => {
        const client = getApiClient();
        return client[prop as keyof typeof client];
    },
});

export default apiClient;
