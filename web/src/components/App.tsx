import { useLaunchParams, miniApp, useSignal, viewport } from "@telegram-apps/sdk-react";
import { AppRoot, Snackbar } from "@telegram-apps/telegram-ui";
import { Navigate, Route, Routes, HashRouter } from "react-router-dom";
import { routes } from "@/navigation/routes.tsx";
import GameProvider from "@/components/Game/context/game-context";
import { useEffect, useRef, useState } from "react";
import { addFriend } from "@/api/friendshipsApi";
import { Friendship } from "@/models/friendship";

export function App() {
    const lp = useLaunchParams();
    const isDark = useSignal(miniApp.isDark);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [newFriend, setNewFriend] = useState<Friendship | null>(null);

    useEffect(() => {
        const init = async () => {
            await new Promise((resolve) => setTimeout(resolve, 100));
            if (viewport.expand.isAvailable()) {
                viewport.expand();
            }
        };
        init();

        const handleScroll = () => {};
        const container = scrollContainerRef.current;
        container?.addEventListener("scroll", handleScroll);

        // Check start param
        if (lp.startParam?.startsWith("friend_")) {
            const userId = lp.startParam.split("_")[1];
            addFriend(parseInt(userId))
                .then((friend) => {
                    console.log(`Friend added: `, friend);
                    setNewFriend(friend);
                })
                .catch((e) => {
                    const ignoreCodes = [400, 409];
                    if (!ignoreCodes.includes(e.response.status)) {
                        console.log(`Failed to add friend: `, e);
                    }
                });
        }
        return () => {
            container?.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <AppRoot
            appearance={isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
            style={{
                height: "100lvh",
                overflow: "hidden",
                position: "relative",
            }}
        >
            <div
                ref={scrollContainerRef}
                style={{
                    overflow: "auto",
                    height: "100%",
                    minHeight: "100%",
                    overscrollBehavior: "none",
                }}
            >
                <HashRouter>
                    <GameProvider>
                        <Routes>
                            {routes.map((route) => (
                                <Route key={route.path} {...route} />
                            ))}
                            <Route path="/" element={<Navigate to="/game" />} />
                            <Route path="*" element={<Navigate to="/game" />} />
                        </Routes>
                    </GameProvider>
                </HashRouter>
                {newFriend && (
                    <Snackbar style={{ zIndex: 3 }} onClose={() => setNewFriend(null)}>
                        Новый друг добавлен!
                    </Snackbar>
                )}
            </div>
        </AppRoot>
    );
}
