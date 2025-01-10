import { Page } from "@/components/Page";
import { Stack } from "@mui/material";
import {
    Button,
    Modal,
    Input,
    Tappable,
    Section,
    Cell,
    ButtonCell,
    List,
    Divider,
    Skeleton,
} from "@telegram-apps/telegram-ui";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import React, { useEffect, useState } from "react";
import generateNickname from "@/helper/nicknameGanarator";
import { getMe, updateMe } from "@/api/usersApi";
import { usersUrlEndpoint } from "@/api/usersApi";
import useSWR, { preload } from "swr";

export const preloadRatingPage = () => {
    preload(usersUrlEndpoint, getMe);
};

const validateNickname = (nickname: string) => {
    if (nickname.length < 2 || nickname.length > 30) {
        return false;
    }

    const regex = /^[a-zA-Z0-9а-яА-ЯёЁ._\- ]+$/;
    return regex.test(nickname);
};

const RatingPage: React.FC = () => {
    const {
        isLoading: isMeLoading,
        error: meError,
        data: me,
        mutate: mutateMe,
    } = useSWR(usersUrlEndpoint, getMe);

    const [inputNickname, setInputNickname] = useState(generateNickname());
    const visibleNickname = me?.nickname ?? inputNickname;

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!isMeLoading && !meError) {
            if (me?.nickname) {
                setInputNickname(me?.nickname);
            }
            setIsModalOpen(!me?.nickname);
        }
    }, [isMeLoading, meError, me?.nickname]);

    const changeNickname = async (nickname: string) => {
        try {
            await updateMe({ nickname: nickname });
            await mutateMe();
            if (hapticFeedback.notificationOccurred.isAvailable())
                hapticFeedback.notificationOccurred("success");
        } catch (error) {
            if (hapticFeedback.notificationOccurred.isAvailable())
                hapticFeedback.notificationOccurred("error");
        }
    };

    return (
        <Page back={true}>
            <List>
                <Section header="Профиль">
                    <Cell
                        before={<PersonIcon />}
                        subtitle="Имя"
                        interactiveAnimation="opacity"
                    >
                        <Skeleton visible={isMeLoading}>
                            {visibleNickname}
                        </Skeleton>
                    </Cell>
                    <ButtonCell
                        before={<EditIcon />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Изменить
                    </ButtonCell>
                </Section>

                <Section
                    header="Лучшие игроки дня"
                    footer="Рейтинг игроков с самыми высокими рекордами за последние 24 часа. Попадите в топ и станьте лучшим!"
                >
                    <Stack>
                        <Cell
                            before="🥇"
                            subtitle="127 350 очков"
                            interactiveAnimation="opacity"
                        >
                            Весёлый Пончик
                        </Cell>
                        <Cell
                            before="🥈"
                            subtitle="68 530 очков"
                            interactiveAnimation="opacity"
                        >
                            TimNekk
                        </Cell>
                        <Cell
                            before="🥉"
                            subtitle="34 290 очков"
                            interactiveAnimation="opacity"
                        >
                            Ваня Фролов
                        </Cell>
                        <Divider />
                        <Cell
                            before={54}
                            subtitle="16 780 очков"
                            interactiveAnimation="opacity"
                        >
                            {visibleNickname}
                        </Cell>
                    </Stack>
                </Section>

                <Section
                    header="Общий зачет"
                    footer="Суммарный рейтинг всех игроков за все время. Чем больше играете и набираете очков, тем выше поднимаетесь!"
                >
                    <Stack>
                        <Cell
                            before="🥇"
                            subtitle="1 239 000 очков"
                            interactiveAnimation="opacity"
                        >
                            Весёлый Пончик
                        </Cell>
                        <Cell
                            before="🥈"
                            subtitle="730 000 очков"
                            interactiveAnimation="opacity"
                        >
                            TimNekk
                        </Cell>
                        <Cell
                            before="🥉"
                            subtitle="589 000 очков"
                            interactiveAnimation="opacity"
                        >
                            Ваня Фролов
                        </Cell>
                        <Divider />
                        <Cell
                            before="342"
                            subtitle="34 000 очков"
                            interactiveAnimation="opacity"
                        >
                            {visibleNickname}
                        </Cell>
                    </Stack>
                </Section>
            </List>

            <Modal
                header={<ModalHeader />}
                modal={false}
                open={isModalOpen}
                onOpenChange={(open) => setIsModalOpen(open)}
            >
                <Stack gap={1}>
                    <Input
                        header="Введите ваше имя"
                        value={inputNickname}
                        onChange={(e) => setInputNickname(e.target.value)}
                        status={
                            validateNickname(inputNickname)
                                ? "default"
                                : "error"
                        }
                        after={
                            <Tappable
                                Component="div"
                                style={{
                                    display: "flex",
                                }}
                                onClick={() => setInputNickname("")}
                            >
                                <CloseIcon />
                            </Tappable>
                        }
                    />
                    <Button
                        size="l"
                        stretched
                        disabled={!validateNickname(inputNickname)}
                        onClick={() => {
                            if (validateNickname(inputNickname)) {
                                changeNickname(inputNickname);
                                setIsModalOpen(false);
                            }
                        }}
                    >
                        Сохранить
                    </Button>
                </Stack>
            </Modal>
        </Page>
    );
};

export default RatingPage;
