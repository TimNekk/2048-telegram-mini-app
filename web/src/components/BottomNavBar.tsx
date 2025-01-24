import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";
import RedeemIcon from "@mui/icons-material/Redeem";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { Tabbar } from "@telegram-apps/telegram-ui";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { preloadPrizesPage } from "@/pages/PrizesPage";
import { preloadRatingPage } from "@/pages/RatingPage";

const BottomNavBar: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Tabbar
            style={{
                zIndex: 999,
                bottom: "calc(-1 * var(--tg-viewport-safe-area-inset-bottom, 0px))",
                paddingBottom: "var(--tg-viewport-safe-area-inset-bottom, 0px)",
                backdropFilter: "blur(2px)",
                height: "82px",
            }}
        >
            <Tabbar.Item
                key={"/game"}
                text="Играть"
                selected={location.pathname === "/game"}
                onClick={() => {
                    hapticFeedback.impactOccurred.ifAvailable("light");
                    navigate("/game");
                }}
            >
                <VideogameAssetIcon />
            </Tabbar.Item>
            <Tabbar.Item
                key={"/prizes"}
                text="Призы"
                selected={location.pathname === "/prizes"}
                onClick={() => {
                    hapticFeedback.impactOccurred.ifAvailable("light");
                    navigate("/prizes");
                }}
                onMouseEnter={preloadPrizesPage}
                onTouchStart={preloadPrizesPage}
            >
                <RedeemIcon />
            </Tabbar.Item>
            <Tabbar.Item
                key={"/rating"}
                text="Рейтинг"
                selected={location.pathname === "/rating"}
                onClick={() => {
                    hapticFeedback.impactOccurred.ifAvailable("light");
                    navigate("/rating");
                }}
                onMouseEnter={preloadRatingPage}
                onTouchStart={preloadRatingPage}
            >
                <EmojiEventsIcon />
            </Tabbar.Item>
        </Tabbar>
    );
};

export default BottomNavBar;
