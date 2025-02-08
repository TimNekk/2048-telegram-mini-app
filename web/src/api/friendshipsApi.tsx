import { Friendship } from "@/models/friendship";
import apiClient from "./apiConfig";
import { User } from "@/models/user";

const friendshipApi = apiClient;

export const friendshipsUrlEndpoint = "/friendships";

export const addFriend = async (friendId: number): Promise<Friendship> => {
    const response = await friendshipApi.post<Friendship>(friendshipsUrlEndpoint, {
        friend_id: friendId,
    });
    return response.data;
};

export const getFriends = async (): Promise<User[]> => {
    const response = await friendshipApi.get<User[]>(friendshipsUrlEndpoint);
    return response.data;
};

export const removeFriend = async (friendId: number): Promise<void> => {
    await friendshipApi.delete(friendshipsUrlEndpoint, { data: { friend_id: friendId } });
};
