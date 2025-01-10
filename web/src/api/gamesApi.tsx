import { Game } from "@/models/game";
import apiClient from "./apiConfig";

const gamesApi = apiClient;

export const gamesUrlEndpoint = "/games";

export const startNewGame = async (): Promise<Game> => {
    const response = await gamesApi.post<Game>(gamesUrlEndpoint);
    return response.data;
};

export const updateGame = async (gameId: string, gameUpdate: Partial<Game>): Promise<Game> => {
    const response = await gamesApi.patch<Game>(`${gamesUrlEndpoint}/${gameId}`, gameUpdate);
    return response.data;
};
