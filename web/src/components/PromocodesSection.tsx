import { PromocodeType } from "@/models/promocodeType";
import { Button, Section, Timeline, Text, Skeleton } from "@telegram-apps/telegram-ui";
import useSWR, { preload } from "swr";
import { promocodesUrlEndpoint, getUserPromocodes, createPromocode } from "@/api/promocodesApi";
import { promocodeTypesUrlEndpoint, getAllPromocodeTypes } from "@/api/promocodeTypesApi";
import { statsUrlEndpoint, getUserStats } from "@/api/statsApi";
import { TimelineItem } from "@telegram-apps/telegram-ui/dist/components/Blocks/Timeline/components/TimelineItem/TimelineItem";
import { formatNumberWithSpaces } from "@/helper/formatter";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/CopyButton";

type PromocodesSection = {
    header: string;
    footer: string;
    type: "record" | "total";
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

export const preloadPromocodesSection = () => {
    preload([statsUrlEndpoint], getUserStats);
    preload([promocodesUrlEndpoint], getUserPromocodes);
    preload([promocodeTypesUrlEndpoint], getAllPromocodeTypes);
};

export const PromocodesSection = ({ header, footer, type }: PromocodesSection) => {
    const {
        isLoading: isStatsLoading,
        error: statsError,
        data: stats,
    } = useSWR([statsUrlEndpoint], getUserStats);

    const {
        isLoading: isPromocodesLoading,
        error: promocodesError,
        data: promocodes,
        mutate: mutatePromocodes,
    } = useSWR([promocodesUrlEndpoint], getUserPromocodes);

    const {
        isLoading: isPromocodesTypesLoading,
        error: promocodesTypesError,
        data: promocodeTypes,
    } = useSWR([promocodeTypesUrlEndpoint], getAllPromocodeTypes);

    const [processedPromocodeTypes, setProcessedPromocodeTypes] = useState<PromocodeType[] | null>(
        null
    );

    const [loadingPromocodeId, setLoadingPromocodeId] = useState<number | null>(null);

    useEffect(() => {
        if (promocodeTypes) {
            setProcessedPromocodeTypes(
                promocodeTypes.filter((pt) => pt.type === type).sort((a, b) => a.score - b.score)
            );
        }
    }, [promocodeTypes]);

    const getPromocodeStatus = (promocodeType: PromocodeType) => {
        const existingPromocode = promocodes?.find((p) => p.promocode_type_id === promocodeType.id);
        if (existingPromocode) {
            return "opened";
        }

        const requiredScore = promocodeType.score;
        const userScore =
            promocodeType.type === "record" ? stats?.record_score : stats?.total_score;

        if (userScore && userScore >= requiredScore) {
            return "ready";
        }

        return "locked";
    };

    const lastActiveIndex = processedPromocodeTypes?.reduce((lastIdx, type, idx) => {
        const status = getPromocodeStatus(type);
        return status === "ready" || status === "opened" ? idx : lastIdx;
    }, -1);

    const getPromocode = async (promocode_type_id: number) => {
        setLoadingPromocodeId(promocode_type_id);
        try {
            await createPromocode(promocodesUrlEndpoint, promocode_type_id);
            await mutatePromocodes();
            hapticFeedback.notificationOccurred.ifAvailable("success");
        } finally {
            setLoadingPromocodeId(null);
        }
    };

    const getItemMode = (index: number) => {
        if (index === lastActiveIndex) {
            return "pre-active";
        } else if (lastActiveIndex && index < lastActiveIndex) {
            return "active";
        }
        return undefined;
    };

    const showTimeline =
        !isStatsLoading &&
        !statsError &&
        !isPromocodesLoading &&
        !promocodesError &&
        !isPromocodesTypesLoading &&
        !promocodesTypesError &&
        processedPromocodeTypes;

    return (
        <Section header={header} footer={footer}>
            {showTimeline && (
                <Timeline>
                    {processedPromocodeTypes!.map((type, index) => {
                        const status = getPromocodeStatus(type);
                        const header = `Промокод на ${type.discount} ₽ от ${type.min_order} ₽`;
                        const code = promocodes?.find((p) => p.promocode_type_id === type.id)?.code;
                        const itemMode = getItemMode(index);

                        return (
                            <TimelineItem key={type.id} header={header} mode={itemMode}>
                                {status === "locked" && (
                                    <Text>{formatNumberWithSpaces(type.score)} очков</Text>
                                )}
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
                                {status === "opened" && <CopyButton>{code ?? "—"}</CopyButton>}
                            </TimelineItem>
                        );
                    })}
                </Timeline>
            )}
            {!showTimeline && TimelineItemsSkeleton(5)}
        </Section>
    );
};
