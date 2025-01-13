import { Page } from "@/components/Page";
import { List } from "@telegram-apps/telegram-ui";
import React from "react";
import { preloadRatingSection, RatingSection } from "@/components/RatingSection";
import { prelaodProfileSection, ProfileSection } from "@/components/ProfileSection";

export const preloadRatingPage = () => {
    prelaodProfileSection();
    preloadRatingSection("daily");
    preloadRatingSection("total");
};

const RatingPage: React.FC = () => {
    return (
        <Page back={false}>
            <List>
                <ProfileSection />

                <RatingSection
                    title="Лучшие игроки дня"
                    footer="Рейтинг игроков с самыми высокими рекордами за последние 24 часа. Попадите в топ и станьте лучшим!"
                    noDataText="Сегодня ещё никто не играл, будь первым!"
                    type="daily"
                />

                <RatingSection
                    title="Общий зачёт"
                    footer="Суммарный рейтинг всех игроков за все время. Чем больше играете и набираете очков, тем выше поднимаетесь!"
                    noDataText="Никто ещё не играл, будь первым!"
                    type="total"
                />
            </List>
        </Page>
    );
};

export default RatingPage;
