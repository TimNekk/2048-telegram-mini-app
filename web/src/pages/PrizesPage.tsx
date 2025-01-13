import React from "react";
import { Page } from "@/components/Page";

import { preloadPromocodesSection, PromocodesSection } from "@/components/PromocodesSection";
import { preloadStatsSection, StatsSection } from "@/components/StatsSection";
import { List } from "@telegram-apps/telegram-ui";

export const preloadPrizesPage = () => {
    preloadStatsSection();
    preloadPromocodesSection();
};

const PrizesPage: React.FC = () => {
    return (
        <Page back={false}>
            <List>
                <StatsSection />

                <PromocodesSection
                    header="За рекорд"
                    footer="Получите призы за лучший результат в одной игре. Чем выше ваш рекорд, тем ценнее награда!"
                    type="record"
                />

                <PromocodesSection
                    header="За все игры"
                    footer="Получите призы за лучший результат во всех играх. Чем выше ваш рекорд, тем ценнее награда!"
                    type="total"
                />
            </List>
        </Page>
    );
};

export default PrizesPage;
