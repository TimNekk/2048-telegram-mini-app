import { Promocode } from "@/models/promocode";
import apiClient from "./apiConfig";

const promocodesApi = apiClient;

export const promocodesUrlEndpoint = "/promocodes";

export const getUserPromocodes = async ([url]: [string]): Promise<Promocode[]> => {
    const response = await promocodesApi.get<Promocode[]>(url);
    return response.data;
};

export const createPromocode = async (url: string, promocodeTypeID: number) => {
    const response = await promocodesApi.post(url, {
        promocode_type_id: promocodeTypeID,
    });
    return response.data;
};
