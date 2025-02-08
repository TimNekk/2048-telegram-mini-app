import { Avatar, Cell, Section } from "@telegram-apps/telegram-ui";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import { Stack } from "@mui/material";
import { useState } from "react";
import { friendshipsUrlEndpoint, getFriends, removeFriend } from "@/api/friendshipsApi";
import { Skeleton } from "@telegram-apps/telegram-ui";
import useSWR from "swr";

export const preloadFriendsSection = () => {};

export const FriendsSection = () => {
    const {
        isLoading: isFriendsLoading,
        error: friendsError,
        data: friends,
        mutate: mutateFriends,
    } = useSWR([friendshipsUrlEndpoint], getFriends);

    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    const getAcronym = (nickname: string): string => {
        if (!nickname) {
            return "";
        }

        const words = nickname.split(" ");
        let acronym = "";

        for (let i = 0; i < Math.min(3, words.length); i++) {
            const word = words[i];
            if (word.length > 0) {
                acronym += word[0].toUpperCase();
            }
        }

        return acronym;
    };

    return (
        <Section
            header={
                <Section.Header>
                    <Stack
                        direction="row"
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        Список друзей
                        {friends?.length !== 0 && !editMode && (
                            <EditIcon fontSize="small" onClick={toggleEditMode} />
                        )}
                        {friends?.length !== 0 && editMode && (
                            <CheckIcon fontSize="small" onClick={toggleEditMode} />
                        )}
                    </Stack>
                </Section.Header>
            }
        >
            <Skeleton visible={isFriendsLoading || friendsError}>
                {!isFriendsLoading && !friendsError && friends?.length === 0 && (
                    <Cell interactiveAnimation="opacity">Друзей пока нет</Cell>
                )}
                {friends?.map((friend) => (
                    <Cell
                        key={friend.id}
                        interactiveAnimation="opacity"
                        before={<Avatar acronym={getAcronym(friend.nickname)} size={40} />}
                        after={
                            editMode && (
                                <CloseIcon
                                    fontSize="small"
                                    onClick={() => {
                                        removeFriend(friend.id).then(() => {
                                            mutateFriends();
                                        });
                                    }}
                                />
                            )
                        }
                    >
                        {friend.nickname}
                    </Cell>
                ))}
            </Skeleton>
        </Section>
    );
};
