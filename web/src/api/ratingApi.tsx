import { RatingPlace } from "@/models/ratingPlace";
import apiClient from "./apiConfig";

const ratingApi = apiClient;

export const ratingUrlEndpoint = "/rating";

export const getDailyRating = async (limit: number): Promise<RatingPlace[]> => {
    const response = await ratingApi.get<RatingPlace[]>(ratingUrlEndpoint, {
        params: { limit: limit, type: "daily" },
    });
    return response.data;
};

export const getTotalRating = async (limit: number): Promise<RatingPlace[]> => {
    const response = await ratingApi.get<RatingPlace[]>(ratingUrlEndpoint, {
        params: { limit: limit, type: "total" },
    });
    return response.data;
};
