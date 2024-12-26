export interface Game {
    id: string;
    user_id: string;
    score: number;
    status: string;
    created_at?: Date;
}