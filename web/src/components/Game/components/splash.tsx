import { GameContext } from "@/components/Game/context/game-context";
import styles from "@/components/Game/styles/splash.module.css";
import { Button, LargeTitle, List } from "@telegram-apps/telegram-ui";
import { useContext } from "react";
import { hapticFeedback } from "@telegram-apps/sdk-react";

export default function Splash({ heading = "You lost!" }) {
    const { startGame } = useContext(GameContext);

    const handleStartGame = () => {
        if (hapticFeedback.impactOccurred.isAvailable()) hapticFeedback.impactOccurred("medium");
        void startGame();
    };

    return (
        <div className={`${styles.splash}`}>
            <List>
                <LargeTitle weight="1">{heading}</LargeTitle>
                <Button onClick={handleStartGame}>Сыграть ещё раз</Button>
            </List>
        </div>
    );
}
