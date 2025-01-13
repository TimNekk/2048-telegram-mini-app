import { Stack } from "@mui/material";
import { Cell, Section, Skeleton } from "@telegram-apps/telegram-ui";
import { statsUrlEndpoint, getUserStats } from "@/api/statsApi";
import useSWR, { preload } from "swr";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ArchiveIcon from "@mui/icons-material/Archive";
import { formatNumberWithSpaces } from "@/helper/formatter";

export const preloadStatsSection = () => {
    preload([statsUrlEndpoint], getUserStats);
};

interface StatItem {
    subtitle: string;
    value: number;
    icon: React.ReactNode;
}

export const StatsSection = () => {
    const {
        isLoading: isStatsLoading,
        error: statsError,
        data: stats,
    } = useSWR([statsUrlEndpoint], getUserStats);

    const showStats = !isStatsLoading && !statsError;

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

    return (
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
    );
};
