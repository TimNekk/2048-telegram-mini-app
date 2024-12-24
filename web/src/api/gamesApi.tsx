import apiClient from './apiConfig';

const gamesApi = apiClient;

export const gamesUrlEndpoint = "/games";

export const startNewGame = async () => {
    const response = await gamesApi.post(gamesUrlEndpoint,);
    return response.data;
}

export const updateGame = async (gameId: string, game: any) => {
    const response = await gamesApi.patch(`${gamesUrlEndpoint}/${gameId}`, game);
    return response.data;
}