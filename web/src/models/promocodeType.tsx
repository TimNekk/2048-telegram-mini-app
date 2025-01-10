export type PromocodeTypeType = "record" | "total";

export interface PromocodeType {
    id: number;
    discount: number;
    min_order: number;
    score: number;
    type: PromocodeTypeType;
    created_at: Date;
}
