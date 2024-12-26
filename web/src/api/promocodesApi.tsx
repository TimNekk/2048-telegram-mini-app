import { Promocode } from '@/models/promocode';
import apiClient from './apiConfig';

const promocodesApi = apiClient;

export const promocodesUrlEndpoint = "/promocodes";

export const getUserPromocodes = async (): Promise<Promocode[]> => {
    const response = await promocodesApi.get<Promocode[]>(promocodesUrlEndpoint);
    return response.data;
}

export const createPromocode = async (promocodeTypeID: number) => {
    const response = await promocodesApi.post(promocodesUrlEndpoint, { promocode_type_id: promocodeTypeID });
    return response.data;
}
