export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    nickname?: string;
    created_at?: Date;
}