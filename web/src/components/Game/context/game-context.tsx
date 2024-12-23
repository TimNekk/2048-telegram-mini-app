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
  const loadSavedState = () => {
    try {
      const savedState = localStorage.getItem('gameState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        if (parsedState.tilesByIds.length > 0) {
          return {
            ...parsedState,
            board: parsedState.board.map((row: any) => [...row]),
            tiles: Object.fromEntries(
              Object.entries(parsedState.tiles).map(([id, tile]: [string, any]) => [
                id,
                { ...tile }
              ])
            ),
            tilesByIds: [...parsedState.tilesByIds],
            hasChanged: false
          };
        }
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
    }
    return initialState;
  };

  const [gameState, dispatch] = useReducer(gameReducer, loadSavedState());

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

  useEffect(() => {
    try {
      if (gameState.tilesByIds.length > 0) {
        localStorage.setItem('gameState', JSON.stringify(gameState));
      }
    } catch (error) {
      console.error('Error saving state:', error);
    }
  }, [gameState]);

  useEffect(() => {
    const savedState = localStorage.getItem('gameState');
    if (!savedState || JSON.parse(savedState).tilesByIds.length === 0) {
      startGame();
    }
  }, []); 

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
