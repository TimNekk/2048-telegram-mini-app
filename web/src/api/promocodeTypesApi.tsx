import { PromocodeType } from "@/models/promocodeType";
import apiClient from "./apiConfig";

const promocodeTypesApi = apiClient;

export const promocodeTypesUrlEndpoint = "/promocode-types";

export const getAllPromocodeTypes = async (): Promise<PromocodeType[]> => {
    const response = await promocodeTypesApi.get<PromocodeType[]>(promocodeTypesUrlEndpoint);
    return response.data;
};
