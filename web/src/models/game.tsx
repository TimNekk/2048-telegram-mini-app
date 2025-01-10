export interface Game {
    id: number;
    user_id: string;
    score: number;
    status: string;
    created_at?: Date;
}
