import { Button } from "@telegram-apps/telegram-ui";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { useState } from "react";

type CopyButtonProps = {
    children: string;
    mode?: "bezeled" | "filled" | "plain" | "gray" | "outline" | "white" | undefined;
    stretched?: boolean;
    copiedDuration?: number;
};

export const CopyButton = ({
    children,
    mode = "bezeled",
    stretched = true,
    copiedDuration = 1100,
}: CopyButtonProps) => {
    const [showCopied, setShowCopied] = useState(false);

    const copy = () => {
        navigator.clipboard
            .writeText(children)
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
        <Button
            before={showCopied ? undefined : <ContentCopyIcon />}
            mode={mode}
            stretched={stretched}
            onClick={() => {
                hapticFeedback.impactOccurred.ifAvailable("medium");
                copy();
            }}
        >
            {showCopied ? "Скопированно!" : children}
        </Button>
    );
};
