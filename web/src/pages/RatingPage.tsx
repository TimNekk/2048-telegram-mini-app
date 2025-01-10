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
import { hapticFeedback, retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { ModalHeader } from "@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import React, { useEffect, useState } from "react";
import generateNickname from "@/helper/nicknameGanarator";
import { getMe, updateMe, usersUrlEndpoint } from "@/api/usersApi";
import { getDailyRating, getTotalRating, ratingUrlEndpoint } from "@/api/ratingApi";
import useSWR, { preload } from "swr";
import { formatNumberWithSpaces } from "@/helper/formatter";
import { RatingPlace } from "@/models/ratingPlace";

export const preloadRatingPage = () => {
    preload(usersUrlEndpoint, getMe);
    preload([ratingUrlEndpoint + "?type=daily", ratingLength], ([, limit]) =>
        getDailyRating(limit)
    );
    preload([ratingUrlEndpoint + "?type=total", ratingLength], ([, limit]) =>
        getTotalRating(limit)
    );
};

const validateNickname = (nickname: string) => {
    if (nickname.length < 2 || nickname.length > 30) {
        return false;
    }

    const regex = /^[a-zA-Z0-9а-яА-ЯёЁ._\- ]+$/;
    return regex.test(nickname);
};

const ratingLength = 3;

const RatingPage: React.FC = () => {
    const {
        isLoading: isMeLoading,
        error: meError,
        data: me,
        mutate: mutateMe,
    } = useSWR(usersUrlEndpoint, getMe);

    const {
        isLoading: isDailyRatingLoading,
        error: dailyRatingError,
        data: dailyRating,
        mutate: mutateDailyRating,
    } = useSWR([ratingUrlEndpoint + "?type=daily", ratingLength], ([, limit]) =>
        getDailyRating(limit)
    );

    const {
        isLoading: isTotalRatingLoading,
        error: totalRatingError,
        data: totalRating,
        mutate: mutateTotalRating,
    } = useSWR([ratingUrlEndpoint + "?type=total", ratingLength], ([, limit]) =>
        getTotalRating(limit)
    );

    const initData = retrieveLaunchParams();
    const currentUserId = initData.initData?.user?.id;

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
            await mutateDailyRating();
            await mutateTotalRating();
            if (hapticFeedback.notificationOccurred.isAvailable())
                hapticFeedback.notificationOccurred("success");
        } catch (error) {
            if (hapticFeedback.notificationOccurred.isAvailable())
                hapticFeedback.notificationOccurred("error");
        }
    };

    const RatingSection: React.FC<{
        title: string;
        footer: string;
        isLoading: boolean;
        error: any;
        data?: RatingPlace[];
    }> = ({ title, footer, isLoading, error, data }) => (
        <Section header={title} footer={footer}>
            <Skeleton visible={isLoading || error != null}>
                {!error && data
                    ?.sort((a, b) => a.place - b.place)
                    .map((rating) => {
                        const isCurrentUser = rating.user_id === currentUserId;
                        const isExtraPosition = rating.place > ratingLength;

                        const medalEmoji =
                            rating.place === 1
                                ? "🥇"
                                : rating.place === 2
                                ? "🥈"
                                : rating.place === 3
                                ? "🥉"
                                : rating.place;

                        return (
                            <React.Fragment key={rating.user_id}>
                                {isExtraPosition && <Divider />}
                                <Cell
                                    before={medalEmoji}
                                    subtitle={`${formatNumberWithSpaces(rating.score)} очков`}
                                >
                                    <span
                                        style={{
                                            fontWeight: isCurrentUser ? 600 : 400,
                                        }}
                                    >
                                        {rating.user_nickname ?? "Аноним"}
                                    </span>
                                </Cell>
                            </React.Fragment>
                        );
                    })}
            </Skeleton>
        </Section>
    );

    return (
        <Page back={true}>
            <List>
                <Section header="Профиль">
                    <Cell before={<PersonIcon />} subtitle="Имя" interactiveAnimation="opacity">
                        <Skeleton visible={isMeLoading}>{visibleNickname}</Skeleton>
                    </Cell>
                    <ButtonCell before={<EditIcon />} onClick={() => setIsModalOpen(true)}>
                        Изменить
                    </ButtonCell>
                </Section>

                <RatingSection
                    title="Лучшие игроки дня"
                    footer="Рейтинг игроков с самыми высокими рекордами за последние 24 часа. Попадите в топ и станьте лучшим!"
                    isLoading={isDailyRatingLoading}
                    error={dailyRatingError}
                    data={dailyRating}
                />

                <RatingSection
                    title="Общий зачёт"
                    footer="Суммарный рейтинг всех игроков за все время. Чем больше играете и набираете очков, тем выше поднимаетесь!"
                    isLoading={isTotalRatingLoading}
                    error={totalRatingError}
                    data={totalRating}
                />
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
                        status={validateNickname(inputNickname) ? "default" : "error"}
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
