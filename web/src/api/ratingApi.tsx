import { RatingPlace } from "@/models/ratingPlace";
import apiClient from "./apiConfig";

const ratingApi = apiClient;

export const ratingUrlEndpoint = "/rating";

export const getRating = async ([url, type, scope, limit]: [
    string,
    "daily" | "total",
    "global" | "friends",
    number
]): Promise<RatingPlace[]> => {
    const response = await ratingApi.get<RatingPlace[]>(url, {
        params: { limit: limit, type: type, scope: scope },
    });
    return response.data;
};
