import { User } from "@/models/user";
import apiClient from "./apiConfig";

const usersApi = apiClient;

export const usersUrlEndpoint = "/user";

export const getMe = async ([url]: [string]): Promise<User> => {
    const response = await usersApi.get<User>(url);
    return response.data;
};

export const updateMe = async (url: string, userUpdate: Partial<User>): Promise<User> => {
    const response = await usersApi.patch<User>(url, userUpdate);
    return response.data;
};
