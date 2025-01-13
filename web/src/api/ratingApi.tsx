import { RatingPlace } from "@/models/ratingPlace";
import apiClient from "./apiConfig";

const ratingApi = apiClient;

export const ratingUrlEndpoint = "/rating";

export const getRating = async ([url, type, limit]: [string, "daily" | "total", number]): Promise<
    RatingPlace[]
> => {
    const response = await ratingApi.get<RatingPlace[]>(url, {
        params: { limit: limit, type: type },
    });
    return response.data;
};
