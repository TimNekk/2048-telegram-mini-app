import {
    PropsWithChildren,
    createContext,
    useCallback,
    useEffect,
    useReducer,
    useRef,
} from "react";
import { isNil, throttle } from "lodash";
import { useLocation } from "react-router-dom";
import { mergeAnimationDuration, tileCountPerDimension } from "@/components/Game/constants";
import { Tile } from "@/components/Game/models/tile";
import gameReducer, { initialState } from "@/components/Game/reducers/game-reducer";
import { hapticFeedback } from "@telegram-apps/sdk-react";
import { gamesUrlEndpoint, startNewGame, updateGame } from "@/api/gamesApi";
import { Game } from "@/models/game";
import { mutate } from "swr";
import { statsUrlEndpoint } from "@/api/statsApi";
import { ratingUrlEndpoint } from "@/api/ratingApi";
import { ratingLength } from "@/constants";

type MoveDirection = "move_up" | "move_down" | "move_left" | "move_right";

export const GameContext = createContext({
    score: 0,
    status: "ongoing",
    gameId: undefined as string | undefined,
    moveTiles: (_: MoveDirection) => {},
    getTiles: () => [] as Tile[],
    startGame: () => {},
});

export default function GameProvider({ children }: PropsWithChildren) {
    const updateGameWithMutations = (gameId: string, gameUpdate: Partial<Game>) => {
        try {
            updateGame(gamesUrlEndpoint, gameId, gameUpdate);
            mutate([statsUrlEndpoint]);
            mutate([ratingUrlEndpoint, "daily", ratingLength]);
            mutate([ratingUrlEndpoint, "total", ratingLength]);
        } catch (error) {
            console.error("Error in game update process:", error);
        }
    };

    const loadSavedState = () => {
        try {
            const savedState = localStorage.getItem("gameState");
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                if (parsedState.tilesByIds.length > 0) {
                    return {
                        ...parsedState,
                        board: parsedState.board.map((row: any) => [...row]),
                        tiles: Object.fromEntries(
                            Object.entries(parsedState.tiles).map(([id, tile]: [string, any]) => [
                                id,
                                { ...tile },
                            ])
                        ),
                        tilesByIds: [...parsedState.tilesByIds],
                        hasChanged: false,
                    };
                }
            }
        } catch (error) {
            console.error("Error loading saved state:", error);
        }
        return initialState;
    };

    const [gameState, dispatch] = useReducer(gameReducer, loadSavedState());
    const initializationPromise = useRef<Promise<void> | null>(null);

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
            (type: MoveDirection) => {
                dispatch({ type });
            },
            mergeAnimationDuration * 1.05,
            { trailing: false }
        ),
        [dispatch]
    );

    const startGame = async () => {
        if (initializationPromise.current) {
            return initializationPromise.current;
        }

        initializationPromise.current = (async () => {
            try {
                const newGame = await startNewGame([gamesUrlEndpoint]);
                dispatch({ type: "reset_game" });
                dispatch({ type: "update_status", status: "ongoing" });
                dispatch({ type: "set_game_id", gameId: newGame.id.toString() });
            } catch (error) {
                console.error("Error starting new game:", error);
                // Still start the game locally even if API call fails
                dispatch({ type: "reset_game" });
                dispatch({ type: "update_status", status: "ongoing" });
            } finally {
                // Clear the promise after initialization is complete
                initializationPromise.current = null;
            }
        })();

        return initializationPromise.current;
    };

    // Handle game initialization after reset
    useEffect(() => {
        if (gameState.tilesByIds.length === 0 && gameState.status === "ongoing") {
            appendRandomTile();
            appendRandomTile();
        }
    }, [gameState.tilesByIds.length, gameState.status]);

    // Initial game start
    useEffect(() => {
        if (gameState.status === "init") {
            void startGame();
        }
    }, [gameState.status]);

    useEffect(() => {
        if (gameState.hasChanged) {
            setTimeout(() => {
                hapticFeedback.selectionChanged.ifAvailable();
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

    // Save game state to localStorage
    useEffect(() => {
        localStorage.setItem("gameState", JSON.stringify(gameState));
    }, [gameState]);

    useEffect(() => {
        console.log("Game status effect:", {
            status: gameState.status,
            gameId: gameState.gameId,
            score: gameState.score,
        });

        if (gameState.status === "lost") {
            const updateGameScore = async () => {
                try {
                    let currentGameId = gameState.gameId;

                    if (!currentGameId) {
                        console.log("No game ID found, creating new game");
                        const newGame = await startNewGame([gamesUrlEndpoint]);
                        currentGameId = newGame.id.toString();
                        console.log("Created new game with ID:", currentGameId);
                    }

                    console.log("Updating game with ID:", currentGameId);
                    const gameUpdate: Partial<Game> = {
                        score: gameState.score,
                        status: "finished",
                    };

                    updateGameWithMutations(currentGameId, gameUpdate);
                    console.log("Successfully updated game score and status");
                } catch (error) {
                    console.error("Error in game update process:", error);
                }
            };

            void updateGameScore();
        }
    }, [gameState.status, gameState.gameId, gameState.score]);

    // Save game score when user switches tabs or navigates away
    useEffect(() => {
        const handleVisibilityChange = () => {
            console.log("Visibility changed:", {
                isHidden: document.hidden,
                gameId: gameState.gameId,
                status: gameState.status,
                score: gameState.score,
            });

            if (document.hidden && gameState.gameId && gameState.status === "ongoing") {
                console.log("Saving score on visibility change:", gameState.score);
                const gameUpdate: Partial<Game> = {
                    score: gameState.score,
                };
                updateGameWithMutations(gameState.gameId, gameUpdate);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        console.log("Added visibility change listener");

        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            console.log("Removed visibility change listener");
        };
    }, [gameState.gameId, gameState.score, gameState.status]);

    // Save game score when navigating away from game page
    const location = useLocation();
    const prevLocationRef = useRef(location);

    useEffect(() => {
        const wasOnGamePage = prevLocationRef.current.pathname === "/game";
        const isLeavingGamePage = wasOnGamePage && location.pathname !== "/game";
        
        if (isLeavingGamePage && gameState.gameId && gameState.status === "ongoing") {
            console.log("Saving score on navigation:", gameState.score);
            const gameUpdate: Partial<Game> = {
                score: gameState.score,
            };
            updateGameWithMutations(gameState.gameId, gameUpdate);
        }
        
        prevLocationRef.current = location;
    }, [location.pathname, gameState.gameId, gameState.score, gameState.status]);

    const checkGameState = () => {
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

    return (
        <GameContext.Provider
            value={{
                score: gameState.score,
                status: gameState.status,
                gameId: gameState.gameId,
                getTiles,
                moveTiles,
                startGame,
            }}
        >
            {children}
        </GameContext.Provider>
    );
}
