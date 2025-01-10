import React from "react";
import { Page } from "@/components/Page";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArchiveIcon from "@mui/icons-material/Archive";
import { Button, Cell, List, Section, Skeleton, Text, Timeline } from "@telegram-apps/telegram-ui";
import { TimelineItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/Timeline/components/TimelineItem/TimelineItem";
import { Stack } from "@mui/material";
import { hapticFeedback } from "@telegram-apps/sdk-react";

import useSWR, { preload } from "swr";
import { statsUrlEndpoint, getUserStats } from "@/api/statsApi";
import { promocodesUrlEndpoint, getUserPromocodes, createPromocode } from "@/api/promocodesApi";
import { promocodeTypesUrlEndpoint, getAllPromocodeTypes } from "@/api/promocodeTypesApi";
import { formatNumberWithSpaces } from "@/helper/formatter";

interface StatItem {
    subtitle: string;
    value: number;
    icon: React.ReactNode;
}

interface PromocodeType {
    id: number;
    type: string;
    score: number;
    discount: number;
    min_order: number;
}

export const preloadPrizesPage = () => {
    preload(statsUrlEndpoint, getUserStats);
    preload(promocodesUrlEndpoint, getUserPromocodes);
    preload(promocodeTypesUrlEndpoint, getAllPromocodeTypes);
};

const TimelineItemsSkeleton = (times: number) => (
    <Timeline>
        {Array.from({ length: times }, (_, index) => (
            <TimelineItem
                key={index}
                header={(<Skeleton visible>Промокод на 100 ₽ от 1000 ₽</Skeleton>) as any}
            >
                <Skeleton visible>1 000 очков</Skeleton>
            </TimelineItem>
        ))}
    </Timeline>
);

const PrizesPage: React.FC = () => {
    const {
        isLoading: isStatsLoading,
        error: statsError,
        data: stats,
    } = useSWR(statsUrlEndpoint, getUserStats);

    const {
        isLoading: isPromocodesLoading,
        error: promocodesError,
        data: promocodes,
        mutate: mutatePromocodes,
    } = useSWR(promocodesUrlEndpoint, getUserPromocodes);

    const {
        isLoading: isPromocodesTypesLoading,
        error: promocodesTypesError,
        data: promocodesTypes,
    } = useSWR(promocodeTypesUrlEndpoint, getAllPromocodeTypes);

    const [loadingPromocodeId, setLoadingPromocodeId] = React.useState<number | null>(null);
    const [copiedTypeId, setCopiedTypeId] = React.useState<number | null>(null);

    const getPromocode = async (promocode_type_id: number) => {
        setLoadingPromocodeId(promocode_type_id);
        try {
            await createPromocode(promocode_type_id);
            await mutatePromocodes();
            if (hapticFeedback.notificationOccurred.isAvailable())
                hapticFeedback.notificationOccurred("success");
        } finally {
            setLoadingPromocodeId(null);
        }
    };

    const statsData: StatItem[] = [
        {
            subtitle: "Рекорд",
            value: stats?.record_score ?? -1,
            icon: <EmojiEventsIcon />,
        },
        {
            subtitle: "За все игры",
            value: stats?.total_score ?? -1,
            icon: <ArchiveIcon />,
        },
    ];

    const getPromocodeStatus = (promocodeType: PromocodeType) => {
        // Check if user already has this promocode
        const existingPromocode = promocodes?.find((p) => p.promocode_type_id === promocodeType.id);
        if (existingPromocode) {
            return "opened";
        }

        // Check if user has enough score
        const requiredScore = promocodeType.score;
        const userScore =
            promocodeType.type === "record" ? stats?.record_score : stats?.total_score;

        if (userScore && userScore >= requiredScore) {
            return "ready";
        }

        return "locked";
    };

    const renderTimelineItems = (promocodeTypes: PromocodeType[]) => {
        const sortedTypes = [...promocodeTypes].sort((a, b) => a.score - b.score);

        // Find the last index with status ready or opened
        const lastActiveIndex = sortedTypes.reduce((lastIdx, type, idx) => {
            const status = getPromocodeStatus(type);
            return status === "ready" || status === "opened" ? idx : lastIdx;
        }, -1);

        return sortedTypes.map((type, index) => {
            const status = getPromocodeStatus(type);
            const header = `Промокод на ${type.discount} ₽ от ${type.min_order} ₽`;

            let itemMode: "pre-active" | "active" | undefined = undefined;
            if (index === lastActiveIndex) {
                itemMode = "pre-active";
            } else if (index < lastActiveIndex) {
                itemMode = "active";
            }

            return (
                <TimelineItem key={type.id} header={header} mode={itemMode}>
                    {status === "locked" && <Text>{formatNumberWithSpaces(type.score)} очков</Text>}
                    {status === "ready" && (
                        <Button
                            mode="filled"
                            stretched
                            loading={loadingPromocodeId === type.id}
                            onClick={() => getPromocode(type.id)}
                        >
                            Получить
                        </Button>
                    )}
                    {status === "opened" && (
                        <Button
                            before={copiedTypeId !== type.id ? <ContentCopyIcon /> : undefined}
                            mode="bezeled"
                            stretched
                            onClick={() => {
                                if (hapticFeedback.impactOccurred.isAvailable())
                                    hapticFeedback.impactOccurred("medium");
                                const code = promocodes?.find(
                                    (p) => p.promocode_type_id === type.id
                                )?.code;
                                if (code) {
                                    navigator.clipboard
                                        .writeText(code)
                                        .then(() => {
                                            setCopiedTypeId(type.id);
                                            setTimeout(() => {
                                                setCopiedTypeId(null);
                                            }, 1100);
                                        })
                                        .catch((error) => {
                                            if (error.name !== "NotAllowedError") {
                                                console.error("Failed to copy:", error);
                                            }
                                        });
                                }
                            }}
                        >
                            {copiedTypeId === type.id
                                ? "Скопированно!"
                                : promocodes?.find((p) => p.promocode_type_id === type.id)?.code}
                        </Button>
                    )}
                </TimelineItem>
            );
        });
    };

    const showTimeline =
        !isStatsLoading &&
        !statsError &&
        !isPromocodesLoading &&
        !promocodesError &&
        !isPromocodesTypesLoading &&
        !promocodesTypesError;
    const showStats = !isStatsLoading && !statsError;

    return (
        <Page back={false}>
            <List>
                <Section header="Статистика">
                    <Stack direction="row" spacing={3}>
                        {statsData.map((stat, index) => (
                            <Cell
                                key={index}
                                subtitle={stat.subtitle}
                                type="text"
                                interactiveAnimation="opacity"
                                before={stat.icon}
                            >
                                {showStats && formatNumberWithSpaces(stat.value)}
                                {!showStats && <Skeleton visible={!showStats}>10 000</Skeleton>}
                            </Cell>
                        ))}
                    </Stack>
                </Section>

                <Section
                    header="За рекорд"
                    footer="Получите призы за лучший результат в одной игре. Чем выше ваш рекорд, тем ценнее награда!"
                >
                    {showTimeline && (
                        <Timeline>
                            {renderTimelineItems(
                                promocodesTypes?.filter((pt) => pt.type === "record") ?? []
                            )}
                        </Timeline>
                    )}
                    {!showTimeline && TimelineItemsSkeleton(5)}
                </Section>

                <Section
                    header="За все игры"
                    footer="Играйте больше и накапливайте очки! Эти призы вы получите за суммарное количество очков во всех играх."
                >
                    {showTimeline && (
                        <Timeline>
                            {renderTimelineItems(
                                promocodesTypes?.filter((pt) => pt.type === "total") ?? []
                            )}
                        </Timeline>
                    )}
                    {!showTimeline && TimelineItemsSkeleton(5)}
                </Section>
            </List>
        </Page>
    );
};

export default PrizesPage;
