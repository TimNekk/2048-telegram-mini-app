import { Page } from "@/components/Page";
import { ButtonCell, List, Section, TabsList } from "@telegram-apps/telegram-ui";
import GroupIcon from "@mui/icons-material/Group";
import { preloadRatingSection, RatingSection } from "@/components/RatingSection";
import { prelaodProfileSection, ProfileSection } from "@/components/ProfileSection";
import { TabsItem } from "@telegram-apps/telegram-ui/dist/components/Navigation/TabsList/components/TabsItem/TabsItem";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { defaultRatingScope } from "@/constants";
import { hapticFeedback } from "@telegram-apps/sdk-react";

export const preloadRatingPage = (scope: "friends" | "global" = defaultRatingScope) => {
    prelaodProfileSection();
    preloadRatingSection("daily", scope);
    preloadRatingSection("total", scope);
};

const RatingPage: React.FC = () => {
    const navigate = useNavigate();
    const [scope, setScope] = useState<"friends" | "global">(defaultRatingScope);

    return (
        <Page back={false}>
            <List>
                <ProfileSection />

                <TabsList>
                    <TabsItem
                        onClick={() => {
                            hapticFeedback.selectionChanged.ifAvailable();
                            setScope("global");
                        }}
                        selected={scope === "global"}
                        onMouseEnter={() => preloadRatingPage("global")}
                        onTouchStart={() => preloadRatingPage("global")}
                    >
                        Весь мир
                    </TabsItem>
                    <TabsItem
                        onClick={() => {
                            hapticFeedback.selectionChanged.ifAvailable();
                            setScope("friends");
                        }}
                        selected={scope === "friends"}
                        onMouseEnter={() => preloadRatingPage("friends")}
                        onTouchStart={() => preloadRatingPage("friends")}
                    >
                        Друзья
                    </TabsItem>
                </TabsList>

                <RatingSection
                    title="Лучшие игроки дня"
                    footer={`Рейтинг ${
                        scope === "friends" ? "друзей" : "игроков"
                    } с самыми высокими рекордами за последние 24 часа. Попадите в топ и станьте лучшим!`}
                    noDataText={`Сегодня ещё никто не играл, будь первым!`}
                    type="daily"
                    scope={scope}
                />

                <RatingSection
                    title="Общий зачёт"
                    footer={`Суммарный рейтинг всех ${
                        scope === "friends" ? "друзей" : "игроков"
                    } за все время. Чем больше играете и набираете очков, тем выше поднимаетесь!`}
                    noDataText="Никто ещё не играл, будь первым!"
                    type="total"
                    scope={scope}
                />

                {scope === "friends" && (
                    <Section>
                        <ButtonCell
                            before={<GroupIcon />}
                            onClick={() => {
                                hapticFeedback.impactOccurred.ifAvailable("medium");
                                navigate("/friends");
                            }}
                        >
                            Список друзей
                        </ButtonCell>
                    </Section>
                )}
            </List>
        </Page>
    );
};

export default RatingPage;
