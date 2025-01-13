import { Stats } from "@/models/stats";
import apiClient from "./apiConfig";

const statsApi = apiClient;

export const statsUrlEndpoint = "/stats";

export const getUserStats = async ([url]: [string]): Promise<Stats> => {
    const response = await statsApi.get<Stats>(url);
    return response.data;
};
