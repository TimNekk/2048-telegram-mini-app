import React, { useContext } from "react";
import Score from "@/components/Game/components/score";
import Board from "@/components/Game/components/board";
import "@/components/Game/styles/globals.css";
import { List } from "@telegram-apps/telegram-ui";
import { Page } from "@/components/Page";
import { GameContext } from "@/components/Game/context/game-context";
import MobileSwiper, { SwipeInput } from "@/components/Game/components/mobile-swiper";

const GamePage: React.FC = () => {
    const { moveTiles, status } = useContext(GameContext);

    const handleSwipe = ({ deltaX, deltaY }: SwipeInput) => {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0) {
                moveTiles("move_right");
            } else {
                moveTiles("move_left");
            }
        } else {
            if (deltaY > 0) {
                moveTiles("move_down");
            } else {
                moveTiles("move_up");
            }
        }
    };

    return (
        <Page back={false} swipeable={false}>
            <MobileSwiper onSwipe={handleSwipe} disabled={status === "lost"}>
                <List>
                    <Score />

                    <div
                        style={{
                            marginTop: "1em",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Board />
                    </div>
                </List>
            </MobileSwiper>
        </Page>
    );
};

export default GamePage;
