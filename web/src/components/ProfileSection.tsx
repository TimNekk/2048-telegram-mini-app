import { Cell, Section, Skeleton } from "@telegram-apps/telegram-ui";
import EditIcon from "@mui/icons-material/Edit";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { getMe, usersUrlEndpoint } from "@/api/usersApi";
import useSWR, { preload } from "swr";
import { NicknameModal } from "./NicknameModal";
import { useState } from "react";
import { InviteUrlCell } from "./InviteUrlCell";

export const prelaodProfileSection = () => {
    preload([usersUrlEndpoint], getMe);
};

export const ProfileSection = () => {
    const { isLoading: isMeLoading, error: meError, data: me } = useSWR([usersUrlEndpoint], getMe);

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Section header="Профиль">
            <Cell
                subtitle="Имя"
                after={
                    <EditIcon
                        onClick={() => {
                            hapticFeedback.impactOccurred.ifAvailable("light");
                            setIsModalOpen(true);
                        }}
                    />
                }
                interactiveAnimation="opacity"
            >
                <Skeleton visible={isMeLoading || meError}>{me?.nickname}</Skeleton>
            </Cell>

            <InviteUrlCell />

            {isModalOpen && <NicknameModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
        </Section>
    );
};
