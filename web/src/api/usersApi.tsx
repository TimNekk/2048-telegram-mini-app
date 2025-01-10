import { User } from "@/models/user";
import apiClient from "./apiConfig";

const usersApi = apiClient;

export const usersUrlEndpoint = "/user";

export const getMe = async (): Promise<User> => {
    const response = await usersApi.get<User>(usersUrlEndpoint);
    return response.data;
};

export const updateMe = async (userUpdate: Partial<User>): Promise<User> => {
    const response = await usersApi.patch<User>(usersUrlEndpoint, userUpdate);
    return response.data;
};
