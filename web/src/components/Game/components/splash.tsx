import { GameContext } from "@/components/Game/context/game-context";
import styles from "@/components/Game/styles/splash.module.css";
import { Button, LargeTitle, List } from "@telegram-apps/telegram-ui";
import { useContext } from "react";

export default function Splash({ heading = "You won!" }) {
  const { startGame } = useContext(GameContext);

  return (
    <div className={`${styles.splash}`}>
      <List>
        <LargeTitle weight="1">
          {heading}
        </LargeTitle>
        <Button onClick={startGame}>
          Сыграть ещё раз
        </Button>
      </List>
    </div>
  );
}
