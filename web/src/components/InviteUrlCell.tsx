import ShareIcon from "@mui/icons-material/Share";
import { hapticFeedback, retrieveLaunchParams, shareURL } from "@telegram-apps/sdk-react";
import { Cell } from "@telegram-apps/telegram-ui";
import { useState } from "react";

type InviteUrlCellProps = {
    copiedDuration?: number;
};

export const InviteUrlCell = ({ copiedDuration = 1100 }: InviteUrlCellProps) => {
    const [showCopied, setShowCopied] = useState(false);

    const initData = retrieveLaunchParams();
    console.log(`initData:`, initData);

    const currentUserId = initData.initData?.user?.id;
    const url = `${import.meta.env.VITE_MINI_APP_URL}?startapp=friend_${currentUserId}`;

    const copy = () => {
        navigator.clipboard
            .writeText(url)
            .then(() => {
                setShowCopied(true);
                setTimeout(() => {
                    setShowCopied(false);
                }, copiedDuration);
            })
            .catch((error) => {
                if (error.name !== "NotAllowedError") {
                    console.error("Failed to copy:", error);
                }
            });
    };

    return (
        <Cell
            after={
                <ShareIcon
                    sx={{ zIndex: 1 }}
                    onClick={() => {
                        shareURL.ifAvailable(url);
                    }}
                />
            }
            subtitle="Приглашение в друзья"
            onClick={() => {
                if (!showCopied) {
                    hapticFeedback.impactOccurred.ifAvailable("medium");
                    copy();
                }
            }}
        >
            {showCopied ? "Скопированно!" : url.replace("https://", "")}
        </Cell>
    );
};
