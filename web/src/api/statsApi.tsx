import { Stats } from '@/models/stats';
import apiClient from './apiConfig';

const statsApi = apiClient;

export const statsUrlEndpoint = "/stats";

export const getUserStats = async (): Promise<Stats> => {
    const response = await statsApi.get<Stats>(statsUrlEndpoint);
    return response.data;
}
