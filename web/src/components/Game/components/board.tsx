import { useCallback, useContext, useEffect, useRef } from "react";
import { Tile as TileModel } from "@/components/Game/models/tile";
import styles from "@/components/Game/styles/board.module.css";
import Tile from "./tile";
import { GameContext } from "@/components/Game/context/game-context";
import Splash from "./splash";

export default function Board() {
  const { getTiles, moveTiles, startGame, status } = useContext(GameContext);
  const initialized = useRef(false);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault();

      switch (e.code) {
        case "ArrowUp":
          moveTiles("move_up");
          break;
        case "ArrowDown":
          moveTiles("move_down");
          break;
        case "ArrowLeft":
          moveTiles("move_left");
          break;
        case "ArrowRight":
          moveTiles("move_right");
          break;
      }
    },
    [moveTiles],
  );

  const renderGrid = () => {
    const cells: JSX.Element[] = [];
    const totalCellsCount = 16;

    for (let index = 0; index < totalCellsCount; index += 1) {
      cells.push(<div className={styles.cell} key={index} />);
    }

    return cells;
  };

  const renderTiles = () => {
    return getTiles().map((tile: TileModel) => (
      <Tile key={`${tile.id}`} {...tile} />
    ));
  };

  useEffect(() => {
    if (initialized.current === false) {
      if (getTiles().length === 0) {
        startGame();
      }
      initialized.current = true;
    }
  }, [startGame, getTiles]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
      <div className={styles.board}>
        {status === "won" && <Splash heading="Победа!" />}
        {status === "lost" && <Splash heading="Игра окончена" />}
        <div className={styles.tiles}>{renderTiles()}</div>
        <div className={styles.grid}>{renderGrid()}</div>
      </div>
  );
}
