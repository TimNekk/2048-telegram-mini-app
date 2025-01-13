import { ButtonCell, Cell, Section, Skeleton } from "@telegram-apps/telegram-ui";
import PersonIcon from "@mui/icons-material/Person";
import EditIcon from "@mui/icons-material/Edit";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { getMe, usersUrlEndpoint } from "@/api/usersApi";
import useSWR, { preload } from "swr";
import { NicknameModal } from "./NicknameModal";
import { useState } from "react";

export const prelaodProfileSection = () => {
    preload([usersUrlEndpoint], getMe);
};

export const ProfileSection = () => {
    const { isLoading: isMeLoading, error: meError, data: me } = useSWR([usersUrlEndpoint], getMe);

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Section header="Профиль">
            <Cell before={<PersonIcon />} subtitle="Имя" interactiveAnimation="opacity">
                <Skeleton visible={isMeLoading || meError}>{me?.nickname}</Skeleton>
            </Cell>
            <ButtonCell
                before={<EditIcon />}
                onClick={() => {
                    hapticFeedback.impactOccurred.ifAvailable("light");
                    setIsModalOpen(true);
                }}
            >
                Изменить
            </ButtonCell>

            {isModalOpen && <NicknameModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} />}
        </Section>
    );
};
