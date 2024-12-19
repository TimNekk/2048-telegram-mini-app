import { GameContext } from "@/components/Game/context/game-context";
import styles from "@/components/Game/styles/score.module.css";
import { useContext } from "react";

export default function Score() {
  const { score } = useContext(GameContext);

  return (
    <div className={styles.score}>
      Score
      <div>{score}</div>
    </div>
  );
}
