import {
  PropsWithChildren,
  createContext,
  useCallback,
  useEffect,
  useReducer,
} from "react";
import { isNil, throttle } from "lodash";
import {
  gameWinTileValue,
  mergeAnimationDuration,
  tileCountPerDimension,
} from "@/components/Game/constants";
import { Tile } from "@/components/Game/models/tile";
import gameReducer, { initialState } from "@/components/Game/reducers/game-reducer";

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
  score: 0,
  status: "ongoing",
  moveTiles: (_: MoveDirection) => { },
  getTiles: () => [] as Tile[],
  startGame: () => { },
});

export default function GameProvider({ children }: PropsWithChildren) {
  const [gameState, dispatch] = useReducer(gameReducer, initialState);

  const getEmptyCells = () => {
    const results: [number, number][] = [];

    for (let x = 0; x < tileCountPerDimension; x++) {
      for (let y = 0; y < tileCountPerDimension; y++) {
        if (isNil(gameState.board[y][x])) {
          results.push([x, y]);
        }
      }
    }
    return results;
  };

  const appendRandomTile = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const cellIndex = Math.floor(Math.random() * emptyCells.length);
      const newTile = {
        position: emptyCells[cellIndex],
        value: Math.random() < 0.9 ? 2 : 4,
      };
      dispatch({ type: "create_tile", tile: newTile });
    }
  };

  const getTiles = () => {
    return gameState.tilesByIds
      .map((tileId) => gameState.tiles[tileId])
      .filter((tile) => tile !== undefined);
  };

  const moveTiles = useCallback(
    throttle(
      (type: MoveDirection) => dispatch({ type }),
      mergeAnimationDuration * 1.05,
      { trailing: false },
    ),
    [dispatch],
  );

  const startGame = () => {
    dispatch({ type: "reset_game" });
    appendRandomTile();
    appendRandomTile();
    // dispatch({ type: "create_tile", tile: { position: [0, 0], value: 2 } });
    // dispatch({ type: "create_tile", tile: { position: [0, 1], value: 4 } });
    // dispatch({ type: "create_tile", tile: { position: [0, 2], value: 8 } });
    // dispatch({ type: "create_tile", tile: { position: [0, 3], value: 16 } });
    // dispatch({ type: "create_tile", tile: { position: [1, 3], value: 32 } });
    // dispatch({ type: "create_tile", tile: { position: [1, 2], value: 64 } });
    // dispatch({ type: "create_tile", tile: { position: [1, 1], value: 128 } });
    // dispatch({ type: "create_tile", tile: { position: [1, 0], value: 256 } });
    // dispatch({ type: "create_tile", tile: { position: [2, 0], value: 512 } });
    // dispatch({ type: "create_tile", tile: { position: [2, 1], value: 1024 } });
    // dispatch({ type: "create_tile", tile: { position: [2, 2], value: 2048 } });
    // dispatch({ type: "create_tile", tile: { position: [2, 3], value: 4096 } });
    // dispatch({ type: "create_tile", tile: { position: [3, 3], value: 8192 } });
    // dispatch({ type: "create_tile", tile: { position: [3, 2], value: 16384 } });
    // dispatch({ type: "create_tile", tile: { position: [3, 1], value: 32768 } });
    // dispatch({ type: "create_tile", tile: { position: [3, 0], value: 65536 } });
  };

  const checkGameState = () => {
    const isWon =
      Object.values(gameState.tiles).filter((t) => t.value === gameWinTileValue)
        .length > 0;

    if (isWon) {
      dispatch({ type: "update_status", status: "won" });
      return;
    }

    const { tiles, board } = gameState;

    // Check for empty cells
    for (let y = 0; y < tileCountPerDimension; y++) {
      for (let x = 0; x < tileCountPerDimension; x++) {
        if (isNil(board[y][x])) {
          return; // Game not over, empty cell found
        }
      }
    }

    // Check for possible merges horizontally
    for (let y = 0; y < tileCountPerDimension; y++) {
      for (let x = 0; x < tileCountPerDimension - 1; x++) {
        if (tiles[board[y][x]].value === tiles[board[y][x + 1]].value) {
          return; // Game not over, horizontal merge possible
        }
      }
    }

    // Check for possible merges vertically
    for (let y = 0; y < tileCountPerDimension - 1; y++) {
      for (let x = 0; x < tileCountPerDimension; x++) {
        if (tiles[board[y][x]].value === tiles[board[y + 1][x]].value) {
          return; // Game not over, vertical merge possible
        }
      }
    }

    dispatch({ type: "update_status", status: "lost" });
  };

  useEffect(() => {
    if (gameState.hasChanged) {
      setTimeout(() => {
        dispatch({ type: "clean_up" });
        appendRandomTile();
      }, mergeAnimationDuration);
    }
  }, [gameState.hasChanged]);

  useEffect(() => {
    if (!gameState.hasChanged) {
      checkGameState();
    }
  }, [gameState.hasChanged]);

  return (
    <GameContext.Provider
      value={{
        score: gameState.score,
        status: gameState.status,
        getTiles,
        moveTiles,
        startGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
