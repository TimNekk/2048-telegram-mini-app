import { getRating, ratingUrlEndpoint } from "@/api/ratingApi";
import { ratingLength } from "@/constants";
import { formatNumberWithSpaces } from "@/helper/formatter";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";
import { Cell, Divider, Section, Skeleton } from "@telegram-apps/telegram-ui";
import React from "react";
import useSWR, { preload } from "swr";

export const preloadRatingSection = (type: "daily" | "total") => {
    preload([ratingUrlEndpoint, type, ratingLength], getRating);
};

export const RatingSection: React.FC<{
    title: string;
    footer: string;
    noDataText: string;
    type: "daily" | "total";
}> = ({ title, footer, noDataText, type }) => {
    const {
        isLoading: isRatingLoading,
        error: ratingError,
        data: rating,
    } = useSWR([ratingUrlEndpoint, type, ratingLength], getRating, {});

    const initData = retrieveLaunchParams();
    const currentUserId = initData.initData?.user?.id;

    return (
        <Section header={title} footer={footer}>
            <Skeleton visible={isRatingLoading || ratingError}>
                {ratingError && <Cell>{ratingError.message}</Cell>}
                {!ratingError && rating?.length === 0 && <Cell>{noDataText}</Cell>}
                {!ratingError &&
                    rating
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
                                        before={
                                            <span style={{ minWidth: "3em", textAlign: "center" }}>
                                                {medalEmoji}
                                            </span>
                                        }
                                        subtitle={`${formatNumberWithSpaces(rating.score)} очков`}
                                    >
                                        <span
                                            style={{
                                                fontWeight: isCurrentUser ? 600 : 400,
                                            }}
                                        >
                                            {rating.user_nickname ?? "Аноним"}
                                        </span>
                                        {isCurrentUser && (
                                            <span
                                                style={{
                                                    color: "var(--tg-theme-subtitle-text-color)",
                                                }}
                                            >
                                                {" (Вы)"}
                                            </span>
                                        )}
                                    </Cell>
                                </React.Fragment>
                            );
                        })}
            </Skeleton>
        </Section>
    );
};
