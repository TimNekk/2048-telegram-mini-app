import { Game } from "@/models/game";
import apiClient from "./apiConfig";

const gamesApi = apiClient;

export const gamesUrlEndpoint = "/games";

export const startNewGame = async ([url]: [string]): Promise<Game> => {
    const response = await gamesApi.post<Game>(url);
    return response.data;
};

export const updateGame = async (
    url: string,
    gameId: string,
    gameUpdate: Partial<Game>
): Promise<Game> => {
    const response = await gamesApi.patch<Game>(`${url}/${gameId}`, gameUpdate);
    return response.data;
};
