import { PromocodeType } from "./promocodeType";

export interface Promocode {
    id: number;
    promocode_type_id: number;
    user_id: number;
    code: string;
    created_at: Date;
    type?: PromocodeType;
}
