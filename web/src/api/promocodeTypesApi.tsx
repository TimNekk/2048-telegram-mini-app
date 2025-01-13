import { PromocodeType } from "@/models/promocodeType";
import apiClient from "./apiConfig";

const promocodeTypesApi = apiClient;

export const promocodeTypesUrlEndpoint = "/promocode-types";

export const getAllPromocodeTypes = async ([url]: [string]): Promise<PromocodeType[]> => {
    const response = await promocodeTypesApi.get<PromocodeType[]>(url);
    return response.data;
};
